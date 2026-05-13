import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FarmersController } from './farmers.controller';
import { FarmersService } from './farmers.service';
import { FarmerProfile } from './farmer.entity';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';
import { Review } from '../reviews/review.entity';
import { Order } from '../orders/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FarmerProfile, User, Product, Review, Order]),
  ],
  controllers: [FarmersController],
  providers: [FarmersService],
  exports: [FarmersService],
})
export class FarmersModule {}
