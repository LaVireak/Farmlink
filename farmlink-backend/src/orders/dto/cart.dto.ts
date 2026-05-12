// src/orders/dto/cart.dto.ts
import { IsUUID, IsInt, Min, IsOptional, IsString } from 'class-validator';

export class CreateCartItemDto {
  @IsUUID()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class UpdateCartItemDto {
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CheckoutDto {
  @IsString()
  paymentMethod: string;

  @IsOptional()
  @IsString()
  deliveryAddress?: string;

  @IsOptional()
  deliveryLat?: number;

  @IsOptional()
  deliveryLng?: number;
}