import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { Category } from './category.entity';
import { ProductStatus } from '../common/enums/product.enum';

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  async onModuleInit() {
    try {
      const count = await this.categoryRepo.count();
      if (count === 0) {
        const defaultCategories = [
          { nameEn: 'Fruits', nameKm: 'ផ្លែឈើ' },
          { nameEn: 'Vegetables', nameKm: 'បន្លែ' },
          { nameEn: 'Leafy Greens', nameKm: 'បន្លែស្លឹក' },
          { nameEn: 'Herbs', nameKm: 'គ្រឿងទេស' },
        ];
        await this.categoryRepo.save(defaultCategories);
        console.log('[ProductsService] Seeded default crop categories.');
      }
    } catch (err) {
      console.error('[ProductsService] Failed to seed default categories:', err);
    }
  }

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
      farmer: p.farmer ? {
        id: p.farmer.id,
        farmName: p.farmer.farmName,
        firstName: p.farmer.user?.firstName,
        lastName: p.farmer.user?.lastName,
        isVerified: p.farmer.isVerified,
      } : null,
    };
  }

  // GET ALL
  async findAll(category?: string, maxPrice?: number, farmerId?: string): Promise<any[]> {
    const qb = this.productRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.category', 'category');

    if (farmerId) {
      qb.where('p.farmerId = :farmerId', { farmerId });
    } else {
      qb.where('p.status = :status', { status: ProductStatus.ACTIVE });
    }

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
      relations: ['category', 'images', 'farmer', 'farmer.user'],
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return this.normalize(product);
  }

  // CREATE
  async create(data: any) {
    const { category, ...rest } = data;
    const product = this.productRepo.create(rest) as unknown as Product;

    if (category) {
      const searchVal = String(category).toLowerCase().trim();
      let cat = await this.categoryRepo.findOne({
        where: [
          { nameEn: category },
          { nameKm: category }
        ]
      });

      if (!cat) {
        const allCats = await this.categoryRepo.find();
        cat = allCats.find(c => {
          const nameEn = String(c.nameEn || '').toLowerCase().trim();
          const nameKm = String(c.nameKm || '').toLowerCase().trim();
          return nameEn === searchVal || 
                 nameKm === searchVal || 
                 nameEn.includes(searchVal) || 
                 searchVal.includes(nameEn) ||
                 (searchVal === 'leafy greens' && nameEn === 'greens') ||
                 (searchVal === 'greens' && nameEn === 'leafy greens') ||
                 (searchVal === 'fruits' && nameEn === 'fruit') ||
                 (searchVal === 'vegetables' && nameEn === 'vegetable');
        }) || null;
      }

      if (!cat) {
        cat = this.categoryRepo.create({
          nameEn: category,
          nameKm: category === 'Fruits' ? 'ផ្លែឈើ' : category === 'Vegetables' ? 'បន្លែ' : category === 'Leafy Greens' ? 'បន្លែស្លឹក' : category === 'Herbs' ? 'គ្រឿងទេស' : category
        });
        await this.categoryRepo.save(cat);
      }

      if (cat) {
        product.category = cat;
      }
    }

    return this.productRepo.save(product);
  }

  // UPDATE
  async update(id: string, data: any) {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    
    const { category, ...rest } = data;
    Object.assign(product, rest);

    if (category) {
      const searchVal = String(category).toLowerCase().trim();
      let cat = await this.categoryRepo.findOne({
        where: [
          { nameEn: category },
          { nameKm: category }
        ]
      });

      if (!cat) {
        const allCats = await this.categoryRepo.find();
        cat = allCats.find(c => {
          const nameEn = String(c.nameEn || '').toLowerCase().trim();
          const nameKm = String(c.nameKm || '').toLowerCase().trim();
          return nameEn === searchVal || 
                 nameKm === searchVal || 
                 nameEn.includes(searchVal) || 
                 searchVal.includes(nameEn) ||
                 (searchVal === 'leafy greens' && nameEn === 'greens') ||
                 (searchVal === 'greens' && nameEn === 'leafy greens') ||
                 (searchVal === 'fruits' && nameEn === 'fruit') ||
                 (searchVal === 'vegetables' && nameEn === 'vegetable');
        }) || null;
      }

      if (!cat) {
        cat = this.categoryRepo.create({
          nameEn: category,
          nameKm: category === 'Fruits' ? 'ផ្លែឈើ' : category === 'Vegetables' ? 'បន្លែ' : category === 'Leafy Greens' ? 'បន្លែស្លឹក' : category === 'Herbs' ? 'គ្រឿងទេស' : category
        });
        await this.categoryRepo.save(cat);
      }

      if (cat) {
        product.category = cat;
      }
    }

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