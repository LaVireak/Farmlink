import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { Category } from './category.entity';
import { ProductImage } from './product-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, ProductImage])],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule {}
