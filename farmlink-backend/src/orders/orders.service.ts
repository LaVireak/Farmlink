import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { OrderResponseDto, OrderPaginationDto, CreateOrderDto, OrderStatsDto, OrderFilterDto } from './dto/order.dto';
import { Product } from '../products/product.entity';
import { PaymentMethod, PaymentStatus } from '../common/enums/payment.enum';
import { OrderStatus } from '../common/enums/order-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  /**
   * Get all orders with pagination and filtering
   */
  async getAllOrders(
    page: number = 1,
    limit: number = 10,
    filters?: OrderFilterDto,
  ): Promise<OrderPaginationDto> {
    const skip = (page - 1) * limit;

    const query = this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.consumer', 'consumer')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .leftJoinAndSelect('items.farmer', 'farmer');

    if (filters?.status) {
      query.andWhere('order.status = :status', { status: filters.status });
    }

    if (filters?.paymentStatus) {
      query.andWhere('order.paymentStatus = :paymentStatus', { paymentStatus: filters.paymentStatus });
    }

    if (filters?.consumerId) {
      query.andWhere('order.consumerId = :consumerId', { consumerId: filters.consumerId });
    }

    if (filters?.startDate && filters?.endDate) {
      query.andWhere('order.createdAt BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    }

    query.orderBy('order.createdAt', 'DESC');
    query.take(limit);
    query.skip(skip);

    const [orders, total] = await query.getManyAndCount();

    return {
      data: orders.map((order) => this.mapToDto(order)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get orders by consumer ID
   */
  async getOrdersByConsumerId(
    consumerId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<OrderPaginationDto> {
    if (!consumerId) {
      throw new BadRequestException('Consumer ID is required');
    }

    const filters: OrderFilterDto = { consumerId };
    return this.getAllOrders(page, limit, filters);
  }

  /**
   * Get a single order by ID
   */
  async getOrderById(id: string): Promise<OrderResponseDto> {
    const order = await this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.consumer', 'consumer')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .leftJoinAndSelect('items.farmer', 'farmer')
      .where('order.id = :id', { id })
      .getOne();

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return this.mapToDto(order);
  }

  /**
   * Create a new order
   */
  async createOrder(createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    if (!createOrderDto.items || createOrderDto.items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    let subtotal = 0;
    for (const item of createOrderDto.items) {
      subtotal += item.unitPrice * item.quantity;
    }

    const deliveryFee = createOrderDto.deliveryLat && createOrderDto.deliveryLng ? 5.0 : 0;
    const totalAmount = subtotal + deliveryFee;

    const orderNumber = this.generateOrderNumber();

    const order = this.ordersRepository.create({
      consumerId: createOrderDto.consumerId,
      orderNumber,
      paymentMethod: createOrderDto.paymentMethod as PaymentMethod,
      paymentStatus: (createOrderDto.paymentStatus as PaymentStatus) || PaymentStatus.UNPAID,
      deliveryAddress: createOrderDto.deliveryAddress,
      deliveryLat: createOrderDto.deliveryLat,
      deliveryLng: createOrderDto.deliveryLng,
      note: createOrderDto.note,
      subtotal,
      deliveryFee,
      totalAmount,
    });

    const savedOrder = await this.ordersRepository.save(order);

    const items: OrderItem[] = [];
    for (const item of createOrderDto.items) {
      const prod = await this.productsRepository.findOne({ where: { id: item.productId } });
      if (!prod) {
        throw new NotFoundException(`Product with ID ${item.productId} not found`);
      }

      if (prod.stockQuantity < item.quantity) {
        throw new BadRequestException(`Insufficient stock for product ${prod.nameEn}. Available: ${prod.stockQuantity}`);
      }

      // Deduct stock and increase totalSold
      prod.stockQuantity -= item.quantity;
      prod.totalSold = (Number(prod.totalSold) || 0) + item.quantity;
      await this.productsRepository.save(prod);

      let farmerId = item.farmerId;
      if (!farmerId || farmerId === 'e1cb5bd7-98b7-4c75-ba7e-36c5332f1111') {
        farmerId = prod.farmerId;
      }

      items.push(
        this.orderItemsRepository.create({
          orderId: savedOrder.id,
          productId: item.productId,
          farmerId: farmerId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.unitPrice * item.quantity,
        }),
      );
    }

    await this.orderItemsRepository.save(items);

    return this.getOrderById(savedOrder.id);
  }

  /**
   * Update order status
   */
  async updateOrderStatus(orderId: string, status: string): Promise<OrderResponseDto> {
    const order = await this.ordersRepository.findOne({ where: { id: orderId } });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    order.status = status as any;

    if (status === 'CONFIRMED') {
      order.confirmedAt = new Date();
    } else if (status === 'DELIVERED') {
      order.deliveredAt = new Date();
    } else if (status === 'CANCELLED') {
      order.cancelledAt = new Date();
    }

    await this.ordersRepository.save(order);
    return this.getOrderById(orderId);
  }

  /**
   * Cancel order
   */
  async cancelOrder(orderId: string, reason?: string): Promise<OrderResponseDto> {
    const order = await this.ordersRepository.findOne({ 
      where: { id: orderId },
      relations: ['items', 'items.product']
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (order.status === OrderStatus.COMPLETED || order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException(`Cannot cancel order with status ${order.status}`);
    }

    // Restore stock and adjust totalSold for each item
    if (order.items && order.items.length > 0) {
      for (const item of order.items) {
        if (item.product) {
          item.product.stockQuantity += item.quantity;
          item.product.totalSold = Math.max(0, (Number(item.product.totalSold) || 0) - item.quantity);
          await this.productsRepository.save(item.product);
        }
      }
    }

    order.status = OrderStatus.CANCELLED;
    order.cancelledAt = new Date();
    order.disputeReason = reason ?? null!;

    await this.ordersRepository.save(order);
    return this.getOrderById(orderId);
  }

  /**
   * Get order statistics
   */
  async getOrderStats(): Promise<OrderStatsDto> {
    const totalOrders = await this.ordersRepository.count();
    const totalRevenue = await this.ordersRepository
      .createQueryBuilder('order')
      .select('SUM(order.total_amount)', 'sum')
      .where('order.payment_status = :status', { status: 'PAID' })
      .getRawOne();

    const pendingOrders = await this.ordersRepository.count({
      where: { status: 'PENDING' as any },
    });

    const completedOrders = await this.ordersRepository.count({
      where: { status: 'DELIVERED' as any },
    });

    const cancelledOrders = await this.ordersRepository.count({
      where: { status: 'CANCELLED' as any },
    });

    const avgOrderValue = totalOrders > 0 ? (parseFloat(totalRevenue?.sum || 0) / totalOrders) : 0;

    return {
      totalOrders,
      totalRevenue: parseFloat(totalRevenue?.sum || 0),
      pendingOrders,
      completedOrders,
      cancelledOrders,
      averageOrderValue: avgOrderValue,
    };
  }

  /**
   * Map Order entity to DTO
   */
  private mapToDto(order: Order): OrderResponseDto {
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      paymentRef: order.paymentRef,
      subtotal: parseFloat(order.subtotal.toString()),
      deliveryFee: parseFloat(order.deliveryFee.toString()),
      totalAmount: parseFloat(order.totalAmount.toString()),
      deliveryAddress: order.deliveryAddress,
      deliveryLat: order.deliveryLat ? parseFloat(order.deliveryLat.toString()) : undefined,
      deliveryLng: order.deliveryLng ? parseFloat(order.deliveryLng.toString()) : undefined,
      note: order.note,
      disputeReason: order.disputeReason,
      confirmedAt: order.confirmedAt,
      deliveredAt: order.deliveredAt,
      cancelledAt: order.cancelledAt,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      consumerId: order.consumerId,
      consumer: order.consumer ? {
        id: order.consumer.id,
        email: order.consumer.email,
        firstName: (order.consumer as any).firstName,
        lastName: (order.consumer as any).lastName,
      } : undefined,
      items: order.items?.map((item) => ({
        id: item.id ?? '',
        productId: item.productId,
        farmerId: item.farmerId,
        quantity: item.quantity,
        unitPrice: parseFloat(item.unitPrice.toString()),
        subtotal: parseFloat(item.subtotal.toString()),
        farmerStatus: item.farmerStatus,
        product: item.product ? {
          id: item.product.id,
          nameEn: item.product.nameEn,
          unit: item.product.unit,
          thumbnailUrl: item.product.thumbnailUrl ?? undefined,
        } : undefined,
        farmer: item.farmer ? {
          id: item.farmer.id,
          farmName: item.farmer.farmName,
        } : undefined,
      })),
    };
  }

  /**
   * Generate unique order number
   */
  private generateOrderNumber(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `ORD-${timestamp}-${random}`;
  }

  private async markOrderPaidByReference(paymentRef: string) {
    const order = await this.ordersRepository.findOne({ where: { paymentRef } });
    if (!order) return;
    if (order.paymentStatus !== PaymentStatus.PAID) {
      order.paymentStatus = PaymentStatus.PAID;
      await this.ordersRepository.save(order);
    }
  }

  private valueToString(value: unknown): string {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    return '';
  }

  /**
   * Create a demo dynamic PayWay QR using ABA PayWay sandbox API
   */
  async createDemoDynamicQr(body: { amount: number; lifetimeMinutes?: number }): Promise<any> {
    const merchantId = process.env.PAYWAY_MERCHANT_ID ?? '';
    const apiKey = process.env.PAYWAY_PUBLIC_KEY ?? '';
    const apiUrl = process.env.PAYWAY_QR_API_URL ?? 'https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/generate-qr';

    if (!merchantId || !apiKey) {
      throw new BadRequestException('PayWay configuration missing');
    }

    // Native JS date formatting (YYYYMMDDHHmmss)
    const now = new Date();
    const reqTime = 
      now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0') +
      now.getHours().toString().padStart(2, '0') +
      now.getMinutes().toString().padStart(2, '0') +
      now.getSeconds().toString().padStart(2, '0');

    const tranId = `FL${Date.now().toString().slice(-10)}${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`;
    const amount = Number(body.amount ?? 1).toFixed(2);
    const lifetime = Number(body.lifetimeMinutes ?? 15);
    
    const firstName = 'Farm';
    const lastName = 'Link';
    const email = 'info@farmlink.com';
    const phone = '012345678';
    const purchaseType = 'purchase';
    const paymentOption = 'abapay_khqr';
    const currency = 'USD';
    const imageTemplate = process.env.PAYWAY_QR_IMAGE_TEMPLATE ?? 'template3_color';
    
    const itemsList = [{ name: 'Order Payment', quantity: 1, price: amount }];
    const items = Buffer.from(JSON.stringify(itemsList)).toString('base64');
    
    const rawCallbackUrl = process.env.PAYWAY_CALLBACK_URL || '';
    const callbackUrlBase64 = rawCallbackUrl ? Buffer.from(rawCallbackUrl).toString('base64') : '';

    const returnDeeplink = '';
    const customFields = '';
    const returnParams = '';
    const payout = '';

    const hashInput = 
      reqTime +
      merchantId +
      tranId +
      amount +
      items +
      firstName +
      lastName +
      email +
      phone +
      purchaseType +
      paymentOption +
      callbackUrlBase64 +
      returnDeeplink +
      currency +
      customFields +
      returnParams +
      payout +
      lifetime +
      imageTemplate;

    const hash = crypto.createHmac('sha512', apiKey).update(hashInput).digest('base64');

    const payload = {
      req_time: reqTime,
      merchant_id: merchantId,
      tran_id: tranId,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      amount,
      purchase_type: purchaseType,
      payment_option: paymentOption,
      items,
      currency,
      callback_url: callbackUrlBase64,
      return_deeplink: returnDeeplink,
      custom_fields: customFields,
      return_params: returnParams,
      payout,
      lifetime,
      qr_image_template: imageTemplate,
      hash,
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as Record<string, any>;
      console.log('[ABA PayWay] Generate QR Response:', JSON.stringify(result));

      const statusCode = (result['status'] as Record<string, any> | undefined)?.['code'];
      if (statusCode !== '0' && statusCode !== '00') {
        const message = (result['status'] as Record<string, any> | undefined)?.['message'] || 'Failed to generate QR';
        throw new BadRequestException(message);
      }

      const qrString = result['qrString'];
      const qrImage = result['qrImage'] || '';
      const abapayDeeplink = result['abapay_deeplink'] || '';
      const expiresAt = new Date(Date.now() + lifetime * 60 * 1000).toISOString();

      return {
        tranId,
        qrString,
        qrImage,
        abapayDeeplink,
        amount: parseFloat(amount),
        currency,
        expiresAt,
      };
    } catch (err: unknown) {
      if (err instanceof BadRequestException) throw err;
      const message = err instanceof Error ? err.message : 'Failed to reach ABA PayWay API';
      throw new BadRequestException(message);
    }
  }

  /**
   * Check payment status by transaction ID
   */
  async checkPaymentStatus(tranId: string): Promise<any> {
    const order = await this.ordersRepository.findOne({ where: { paymentRef: tranId } });

    const merchantId = process.env.PAYWAY_MERCHANT_ID ?? '';
    const apiKey = process.env.PAYWAY_PUBLIC_KEY ?? '';
    const checkUrl = process.env.PAYWAY_CHECK_TRANSACTION_URL ?? 'https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/check-transaction-2';

    const now = new Date();
    const reqTime = 
      now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0') +
      now.getHours().toString().padStart(2, '0') +
      now.getMinutes().toString().padStart(2, '0') +
      now.getSeconds().toString().padStart(2, '0');

    // Hash for check transaction: HMAC-SHA512(req_time + merchant_id + tran_id)
    const hashInput = `${reqTime}${merchantId}${tranId}`;
    const hash = crypto.createHmac('sha512', apiKey).update(hashInput).digest('base64');

    const payload = {
      merchant_id: merchantId,
      req_time: reqTime,
      tran_id: tranId,
      hash,
    };

    try {
      const response = await fetch(checkUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as Record<string, any>;
      console.log('[PayWay Status] response:', JSON.stringify(result));

      const data = result['data'] as Record<string, any> | undefined;
      const paymentStatusCode = data?.['payment_status_code'];
      
      let paymentStatus: 'unpaid' | 'paid' | 'failed' | 'refunded' = 'unpaid';
      const providerStatus = data?.['payment_status'] ?? 'PENDING';

      if (paymentStatusCode === 0 || paymentStatusCode === '0') {
        paymentStatus = 'paid';
      } else if (paymentStatusCode === 2 || paymentStatusCode === '2') {
        paymentStatus = 'unpaid';
      } else if (paymentStatusCode === 4 || paymentStatusCode === '4') {
        paymentStatus = 'failed';
      }

      if (order && order.paymentStatus !== (paymentStatus as any)) {
        order.paymentStatus = paymentStatus as any;
        await this.ordersRepository.save(order);
      }

      return {
        orderId: order?.id,
        paymentStatus,
        providerStatus,
        tranId,
      };
    } catch (err) {
      console.error('[PayWay Status Check Failed]', err);
      if (order) {
        return {
          orderId: order.id,
          paymentStatus: order.paymentStatus,
          providerStatus: 'OFFLINE_CHECK',
          tranId,
        };
      }
      throw new NotFoundException(`Unable to check status for transaction ${tranId}`);
    }
  }

  /**
   * Handle PayWay webhook callback
   */
  async handlePayWayWebhook(payload: Record<string, unknown>): Promise<any> {
    const tranId = this.valueToString(payload['tran_id']);
    if (tranId) {
      await this.markOrderPaidByReference(tranId);
    }
    return { received: true };
  }
}
