import { IsString, IsUUID, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class CreateMessageDto {
  @IsUUID()
  @IsNotEmpty()
  senderId: string;

  @IsUUID()
  @IsNotEmpty()
  receiverId: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  content: string;

  @IsUUID()
  @IsOptional()
  productId?: string;

  @IsUUID()
  @IsOptional()
  orderId?: string;
}
