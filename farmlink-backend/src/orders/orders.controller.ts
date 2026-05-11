import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { OrdersService } from './orders.service';

type CreateDynamicQrRequest = {
	amount: number;
	currency?: 'USD' | 'KHR';
	orderId?: string;
	lifetimeMinutes?: number;
	firstName?: string;
	lastName?: string;
	email?: string;
	phone?: string;
};

@Controller('orders')
export class OrdersController {
	constructor(private readonly ordersService: OrdersService) {}

	@Public()
	@Post('payments/payway/qr/demo')
	createDemoDynamicQr(@Body() body: CreateDynamicQrRequest) {
		return this.ordersService.createDemoDynamicQr(body);
	}

	@Public()
	@Post('payments/payway/qr')
	createDynamicQr(@Body() body: CreateDynamicQrRequest) {
		return this.ordersService.createDynamicQr(body);
	}

	@Public()
	@Get('payments/payway/:tranId/status')
	getPaymentStatus(@Param('tranId') tranId: string) {
		return this.ordersService.checkPaymentStatus(tranId);
	}

	@Public()
	@Post('payments/payway/webhook')
	receivePaymentWebhook(@Body() payload: Record<string, unknown>) {
		return this.ordersService.handlePayWayWebhook(payload);
	}
}
