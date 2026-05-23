import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { Category } from './category.entity';
import { ProductStatus } from '../common/enums/product.enum';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  // Normalize a Product entity to the shape the frontend expects
  private normalize(p: Product) {
    return {
      id: p.id,
      name: p.nameEn,
      category: (p.category as any)?.nameEn || null,
      price: Number(p.pricePerUnit),
      image: p.thumbnailUrl || null,
      description: p.description || null,
      rating: p.avgRating ? Number(p.avgRating) : null,
      badge: p.isOrganic ? 'Organic' : null,
      discount: null,
      unit: p.unit,
      stock: p.stockQuantity,
    };
  }

  // GET ALL
  async findAll(category?: string, maxPrice?: number): Promise<any[]> {
    const qb = this.productRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.category', 'category')
      .where('p.status = :status', { status: ProductStatus.ACTIVE });

    if (category) {
      const cats = category.split(',');
      qb.andWhere('category.nameEn IN (:...cats)', { cats });
    }

    if (maxPrice) {
      qb.andWhere('p.pricePerUnit <= :maxPrice', { maxPrice });
    }

    const products = await qb.orderBy('p.createdAt', 'DESC').getMany();
    return products.map((p) => this.normalize(p));
  }

  // GET ONE
  async findOne(id: string): Promise<any> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['category', 'images'],
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return this.normalize(product);
  }

  // CREATE
  async create(data: any) {
    const product = this.productRepo.create(data);
    return this.productRepo.save(product);
  }

  // UPDATE
  async update(id: string, data: any) {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    Object.assign(product, data);
    return this.productRepo.save(product);
  }

  // DELETE
  async remove(id: string) {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    await this.productRepo.remove(product);
    return { message: 'Product deleted successfully' };
  }
}