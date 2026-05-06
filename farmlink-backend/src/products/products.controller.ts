import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  // GET /products
  @Get()
  getProducts(
    @Query('category') category?: string,
    @Query('maxPrice') maxPrice?: string,
  ) {
    return this.productService.findAll(
      category,
      maxPrice ? Number(maxPrice) : undefined,
    );
  }

  // GET /products/:id
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.productService.findOne(Number(id));
  }

  // POST /products
  @Post()
  create(@Body() body: any) {
    return this.productService.create(body);
  }

  // PATCH /products/:id
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.productService.update(Number(id), body);
  }

  // DELETE /products/:id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(Number(id));
  }
}