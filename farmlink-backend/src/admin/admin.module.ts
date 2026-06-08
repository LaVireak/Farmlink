import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../users/user.entity';
import { FarmerProfile } from '../farmers/farmer.entity';
import { Order } from '../orders/order.entity';
import { Product } from '../products/product.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([User, FarmerProfile, Order, Product])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
