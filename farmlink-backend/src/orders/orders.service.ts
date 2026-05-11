import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { createHmac } from 'crypto';
import { Repository } from 'typeorm';
import { PaymentMethod, PaymentStatus } from '../common/enums/payment.enum';
import { Order } from './order.entity';

type CreateDynamicQrInput = {
	amount: number;
	currency?: 'USD' | 'KHR';
	orderId?: string;
	lifetimeMinutes?: number;
	firstName?: string;
	lastName?: string;
	email?: string;
	phone?: string;
};

type PayWayStatusData = {
	payment_status_code?: number;
	payment_status?: string;
	payment_amount?: number;
	payment_currency?: string;
	transaction_date?: string;
};

@Injectable()
export class OrdersService {
	private readonly logger = new Logger(OrdersService.name);

	constructor(
		private readonly configService: ConfigService,
		@InjectRepository(Order)
		private readonly ordersRepository: Repository<Order>,
	) {}

	async createDemoDynamicQr(input: CreateDynamicQrInput) {
		// Demo endpoint: creates a temporary test order and generates QR
		try {
			// Create a demo order (without a real user)
			const demoOrder = this.ordersRepository.create({
				consumerId: 'demo-test-user-' + Date.now(),
				orderNumber: 'DEMO-' + Date.now().toString().slice(-8),
				status: 'pending' as any,
				paymentMethod: 'aba_payway' as any,
				paymentStatus: 'unpaid' as any,
				subtotal: input.amount || 0.1,
				deliveryFee: 0,
				totalAmount: input.amount || 0.1,
			});
			const savedOrder = await this.ordersRepository.save(demoOrder);
			
			// Generate QR with the demo order ID
			const qrInput = { ...input, orderId: savedOrder.id };
			return this.createDynamicQr(qrInput);
		} catch (error) {
			this.logger.warn('Demo order creation failed, generating QR without order tracking');
			return this.createDynamicQr(input);
		}
	}

	async createDynamicQr(input: CreateDynamicQrInput) {
		if (!input?.amount || Number(input.amount) <= 0) {
			throw new BadRequestException('amount must be greater than 0');
		}

		const config = this.getPayWayConfig();
		const amount = Number(input.amount);
		const currency = input.currency ?? 'USD';
		const reqTime = this.getReqTime();
		const tranId = this.generateTranId(input.orderId);

		const firstName = input.firstName ?? '';
		const lastName = input.lastName ?? '';
		const email = input.email ?? '';
		const phone = input.phone ?? '';
		const purchaseType = 'purchase';
		const paymentOption = 'abapay_khqr';
		const items = '';
		const callbackUrl = config.callbackUrl
			? Buffer.from(config.callbackUrl).toString('base64')
			: '';
		const returnDeeplink = '';
		const customFields = input.orderId
			? Buffer.from(JSON.stringify({ orderId: input.orderId })).toString('base64')
			: '';
		const returnParams = '';
		const payout = '';
		const lifetime = this.normalizeLifetime(input.lifetimeMinutes);
		const qrImageTemplate = config.qrImageTemplate;

		const hashInput =
			reqTime +
			config.merchantId +
			tranId +
			amount +
			items +
			firstName +
			lastName +
			email +
			phone +
			purchaseType +
			paymentOption +
			callbackUrl +
			returnDeeplink +
			currency +
			customFields +
			returnParams +
			payout +
			lifetime +
			qrImageTemplate;

		const hash = this.sign(hashInput, config.publicKey);

		const payload: Record<string, unknown> = {
			req_time: reqTime,
			merchant_id: config.merchantId,
			tran_id: tranId,
			amount,
			currency,
			payment_option: paymentOption,
			purchase_type: purchaseType,
			lifetime,
			qr_image_template: qrImageTemplate,
			hash,
		};

		if (firstName) payload.first_name = firstName;
		if (lastName) payload.last_name = lastName;
		if (email) payload.email = email;
		if (phone) payload.phone = phone;
		if (callbackUrl) payload.callback_url = callbackUrl;
		if (customFields) payload.custom_fields = customFields;

		const response = await fetch(config.qrApiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		});

		const data = (await response.json()) as Record<string, any>;
		const statusCode = data?.status?.code;

		if (!response.ok || statusCode !== '0') {
			this.logger.error(`PayWay QR create failed: ${JSON.stringify(data)}`);
			throw new InternalServerErrorException(
				data?.status?.message || 'Unable to create PayWay dynamic QR',
			);
		}

		await this.upsertOrderPaymentReference(input.orderId, tranId);

		return {
			tranId,
			qrString: data.qrString,
			qrImage: data.qrImage,
			abapayDeeplink: data.abapay_deeplink,
			amount: data.amount,
			currency: data.currency,
			expiresAt: new Date(Date.now() + lifetime * 60 * 1000).toISOString(),
		};
	}

	async checkPaymentStatus(tranId: string) {
		if (!tranId) {
			throw new BadRequestException('tranId is required');
		}

		const config = this.getPayWayConfig();
		const reqTime = this.getReqTime();
		const hashInput = reqTime + config.merchantId + tranId;
		const hash = this.sign(hashInput, config.publicKey);

		const response = await fetch(config.checkTransactionUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				req_time: reqTime,
				merchant_id: config.merchantId,
				tran_id: tranId,
				hash,
			}),
		});

		const data = (await response.json()) as {
			data?: PayWayStatusData;
			status?: { code?: string; message?: string };
		};

		const providerStatusCode = Number(data?.data?.payment_status_code ?? -1);
		const mappedStatus = this.mapPayWayStatus(providerStatusCode, data?.data?.payment_status);

		if (mappedStatus === PaymentStatus.PAID) {
			await this.markOrderPaidByReference(tranId);
		}

		return {
			tranId,
			paymentStatus: mappedStatus,
			providerStatusCode,
			providerStatus: data?.data?.payment_status ?? data?.status?.message ?? 'UNKNOWN',
			paymentAmount: data?.data?.payment_amount,
			paymentCurrency: data?.data?.payment_currency,
			transactionDate: data?.data?.transaction_date,
			raw: data,
		};
	}

	async handlePayWayWebhook(payload: Record<string, unknown>) {
		const transactionId =
			this.toString(payload.transaction_id) || this.toString(payload.merchant_ref);

		const paymentStatusCode = Number(payload.payment_status_code ?? -1);
		const paymentStatus = this.toString(payload.payment_status);

		const mappedStatus = this.mapPayWayStatus(paymentStatusCode, paymentStatus);

		if (transactionId && mappedStatus === PaymentStatus.PAID) {
			await this.markOrderPaidByReference(transactionId);
		}

		return {
			accepted: true,
			transactionId,
			paymentStatus: mappedStatus,
		};
	}

	private getPayWayConfig() {
		const merchantId = this.configService.get<string>('PAYWAY_MERCHANT_ID');
		const publicKey = this.configService.get<string>('PAYWAY_PUBLIC_KEY');

		if (!merchantId || !publicKey) {
			throw new InternalServerErrorException(
				'Missing PAYWAY_MERCHANT_ID or PAYWAY_PUBLIC_KEY configuration',
			);
		}

		return {
			merchantId,
			publicKey,
			qrApiUrl:
				this.configService.get<string>('PAYWAY_QR_API_URL') ||
				'https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/generate-qr',
			checkTransactionUrl:
				this.configService.get<string>('PAYWAY_CHECK_TRANSACTION_URL') ||
				'https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/check-transaction-2',
			callbackUrl: this.configService.get<string>('PAYWAY_CALLBACK_URL') || '',
			qrImageTemplate:
				this.configService.get<string>('PAYWAY_QR_IMAGE_TEMPLATE') || 'template3_color',
		};
	}

	private getReqTime() {
		const d = new Date();
		const year = d.getUTCFullYear();
		const month = String(d.getUTCMonth() + 1).padStart(2, '0');
		const day = String(d.getUTCDate()).padStart(2, '0');
		const hour = String(d.getUTCHours()).padStart(2, '0');
		const minute = String(d.getUTCMinutes()).padStart(2, '0');
		const second = String(d.getUTCSeconds()).padStart(2, '0');

		return `${year}${month}${day}${hour}${minute}${second}`;
	}

	private normalizeLifetime(value?: number) {
		const defaultMinutes = 15;
		const min = 3;
		const max = 172800;

		if (!value) return defaultMinutes;
		if (value < min) return min;
		if (value > max) return max;

		return Math.floor(value);
	}

	private generateTranId(orderId?: string) {
		const timestamp = Date.now().toString().slice(-10);
		const orderPart = (orderId || '').replace(/-/g, '').slice(0, 8);
		const seed = `${orderPart}${timestamp}`;
		return (seed || timestamp).slice(0, 20);
	}

	private sign(input: string, key: string) {
		return createHmac('sha512', key).update(input).digest('base64');
	}

	private mapPayWayStatus(code: number, status?: string) {
		const upperStatus = (status || '').toUpperCase();

		if (code === 0 || upperStatus === 'APPROVED' || upperStatus === 'PRE-AUTH') {
			return PaymentStatus.PAID;
		}

		if (code === 4 || upperStatus === 'REFUNDED') {
			return PaymentStatus.REFUNDED;
		}

		if (code === 2 || upperStatus === 'PENDING') {
			return PaymentStatus.UNPAID;
		}

		if (code === 3 || code === 7 || upperStatus === 'DECLINED' || upperStatus === 'CANCELLED') {
			return PaymentStatus.FAILED;
		}

		return PaymentStatus.UNPAID;
	}

	private async upsertOrderPaymentReference(orderId: string | undefined, tranId: string) {
		if (!orderId) return;

		const order = await this.ordersRepository.findOne({ where: { id: orderId } });
		if (!order) return;

		order.paymentMethod = PaymentMethod.ABA_PAYWAY;
		order.paymentRef = tranId;
		order.paymentStatus = PaymentStatus.UNPAID;
		await this.ordersRepository.save(order);
	}

	private async markOrderPaidByReference(paymentRef: string) {
		const order = await this.ordersRepository.findOne({ where: { paymentRef } });
		if (!order) return;

		if (order.paymentStatus !== PaymentStatus.PAID) {
			order.paymentStatus = PaymentStatus.PAID;
			await this.ordersRepository.save(order);
		}
	}

	private toString(value: unknown) {
		if (typeof value === 'string') return value;
		if (typeof value === 'number') return String(value);
		return '';
	}
}
