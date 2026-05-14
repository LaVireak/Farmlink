import { Controller, Get, Post, Patch, Param, Query, Body, ParseIntPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderResponseDto, OrderPaginationDto, CreateOrderDto, UpdateOrderStatusDto, OrderStatsDto, OrderFilterDto } from './dto/order.dto';

@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * Get all orders with pagination
   * GET /api/orders?page=1&limit=10&status=PENDING
   */
  @Get()
  async getAllOrders(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('status') status?: string,
    @Query('paymentStatus') paymentStatus?: string,
    @Query('consumerId') consumerId?: string,
  ): Promise<OrderPaginationDto> {
    const filters: OrderFilterDto = {
      status,
      paymentStatus,
      consumerId,
      page,
      limit,
    };
    return this.ordersService.getAllOrders(page, limit, filters);
  }

  /**
   * Get orders by consumer ID
   * GET /api/orders/consumer/:consumerId?page=1&limit=10
   */
  @Get('consumer/:consumerId')
  async getOrdersByConsumerId(
    @Param('consumerId') consumerId: string,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ): Promise<OrderPaginationDto> {
    return this.ordersService.getOrdersByConsumerId(consumerId, page, limit);
  }

  /**
   * Get order statistics
   * GET /api/orders/stats
   */
  @Get('stats')
  async getOrderStats(): Promise<OrderStatsDto> {
    return this.ordersService.getOrderStats();
  }

  /**
   * Get a single order by ID
   * GET /api/orders/:id
   */
  @Get(':id')
  async getOrderById(@Param('id') id: string): Promise<OrderResponseDto> {
    return this.ordersService.getOrderById(id);
  }

  /**
   * Create a new order
   * POST /api/orders
   */
  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    return this.ordersService.createOrder(createOrderDto);
  }

  /**
   * Update order status
   * PATCH /api/orders/:id/status
   */
  @Patch(':id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateOrderStatusDto,
  ): Promise<OrderResponseDto> {
    return this.ordersService.updateOrderStatus(id, updateStatusDto.status);
  }

  /**
   * Cancel order
   * PATCH /api/orders/:id/cancel
   */
  @Patch(':id/cancel')
  async cancelOrder(
    @Param('id') id: string,
    @Body() body?: { reason?: string },
  ): Promise<OrderResponseDto> {
    return this.ordersService.cancelOrder(id, body?.reason);
  }
}

