import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FarmersController } from './farmers.controller';
import { FarmersService } from './farmers.service';
import { FarmerProfile } from './farmer.entity';
import { User } from '../users/user.entity';
import { Order } from '../orders/order.entity';
import { Notification } from '../notifications/notification.entity';
import { Product } from '../products/product.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FarmerProfile,
      User,
      Order,
      Notification,
      Product,
    ]),
    AuthModule,
  ],
  controllers: [FarmersController],
  providers: [FarmersService],
})
export class FarmersModule {}
