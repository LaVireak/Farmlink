export class OrderItemDto {
  id: string;
  productId: string;
  farmerId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  farmerStatus: string;
  product?: {
    id: string;
    nameEn: string;
    unit: string;
    thumbnailUrl?: string;
  };
  farmer?: {
    id: string;
    farmName: string;
    province?: string;
    district?: string;
  };
}

export class ConsumerDto {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export class OrderResponseDto {
  id: string;
  orderNumber: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  paymentRef?: string;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  deliveryAddress?: string;
  deliveryLat?: number;
  deliveryLng?: number;
  note?: string;
  disputeReason?: string;
  confirmedAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  consumerId: string;
  consumer?: ConsumerDto;
  items?: OrderItemDto[];
}

export class OrderPaginationDto {
  data: OrderResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class CreateOrderDto {
  consumerId: string;
  paymentMethod: string;
  paymentStatus?: string;
  paymentRef?: string;
  deliveryAddress?: string;
  deliveryLat?: number;
  deliveryLng?: number;
  note?: string;
  items: {
    productId: string;
    farmerId: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export class UpdateOrderStatusDto {
  status: string;
}

export class OrderStatsDto {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  averageOrderValue: number;
}

export class OrderFilterDto {
  status?: string;
  paymentStatus?: string;
  consumerId?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}
