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
import { Public } from '../auth/decorators/public.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Public()
  @Get()
  getProducts(
    @Query('category') category?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('farmerId') farmerId?: string,
  ) {
    return this.productService.findAll(
      category,
      maxPrice ? Number(maxPrice) : undefined,
      farmerId,
    );
  }

  @Public()
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Post()
  create(@Body() body: any) {
    return this.productService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.productService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
