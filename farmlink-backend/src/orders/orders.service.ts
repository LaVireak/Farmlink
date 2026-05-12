import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { OrderResponseDto, OrderPaginationDto, CreateOrderDto, OrderStatsDto, OrderFilterDto } from './dto/order.dto';
import { Product } from '../products/product.entity';

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
      query.andWhere('order.payment_status = :paymentStatus', { paymentStatus: filters.paymentStatus });
    }

    if (filters?.consumerId) {
      query.andWhere('order.consumer_id = :consumerId', { consumerId: filters.consumerId });
    }

    if (filters?.startDate && filters?.endDate) {
      query.andWhere('order.created_at BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    }

    query.orderBy('order.created_at', 'DESC');
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

    // Calculate totals
    let subtotal = 0;
    for (const item of createOrderDto.items) {
      subtotal += item.unitPrice * item.quantity;
    }

    const deliveryFee = createOrderDto.deliveryLat && createOrderDto.deliveryLng ? 5.0 : 0;
    const totalAmount = subtotal + deliveryFee;

    // Generate order number
    const orderNumber = this.generateOrderNumber();

    // Create order
    const order = this.ordersRepository.create({
      consumerId: createOrderDto.consumerId,
      orderNumber,
      paymentMethod: createOrderDto.paymentMethod,
      deliveryAddress: createOrderDto.deliveryAddress,
      deliveryLat: createOrderDto.deliveryLat,
      deliveryLng: createOrderDto.deliveryLng,
      note: createOrderDto.note,
      subtotal,
      deliveryFee,
      totalAmount,
    });

    const savedOrder = await this.ordersRepository.save(order);

    // Create order items
    const items = createOrderDto.items.map((item) =>
      this.orderItemsRepository.create({
        orderId: savedOrder.id,
        productId: item.productId,
        farmerId: item.farmerId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.unitPrice * item.quantity,
      }),
    );

    await this.orderItemsRepository.save(items);

    // Fetch and return complete order
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
    const order = await this.ordersRepository.findOne({ where: { id: orderId } });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (order.status === 'DELIVERED' || order.status === 'CANCELLED') {
      throw new BadRequestException(`Cannot cancel order with status ${order.status}`);
    }

    order.status = 'CANCELLED' as any;
    order.cancelledAt = new Date();
    order.disputeReason = reason;

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
      deliveryLat: order.deliveryLat ? parseFloat(order.deliveryLat.toString()) : null,
      deliveryLng: order.deliveryLng ? parseFloat(order.deliveryLng.toString()) : null,
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
      } : null,
      items: order.items?.map((item) => ({
        id: item.id,
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
          thumbnailUrl: item.product.thumbnailUrl,
        } : null,
        farmer: item.farmer ? {
          id: item.farmer.id,
          farmName: item.farmer.farmName,
        } : null,
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
}

