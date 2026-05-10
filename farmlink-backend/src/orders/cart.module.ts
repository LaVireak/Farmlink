import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';
import { Product } from '../products/product.entity';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { OrdersModule } from './orders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem, Product]),
    OrdersModule, // so we can call OrdersService.createOrder on checkout
  ],
  providers: [CartService],
  controllers: [CartController],
  exports: [CartService],
})
export class CartModule {}