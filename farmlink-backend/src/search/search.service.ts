import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ProductsService } from '../products/products.service';

@Injectable()
export class SearchService {
  constructor(
    @InjectDataSource() private db: DataSource,
    private readonly productsService: ProductsService,
  ) {}

  async search(q: string) {
    // Ensure q is defined and not empty
    if (!q || q.trim().length === 0) {
      return [];
    }

    const query = q.trim().toLowerCase();
    const searchPattern = `%${q.trim()}%`;

    // Search farms from the real Supabase DB
    let farms: any[] = [];
    try {
      farms = await this.db.query(
        `
              SELECT 
                fp.id,
                fp.farm_name AS name,
                fp.description,
                fp.province AS category,
                fp.cover_image_url AS image,
                'farm' AS type
              FROM farmer_profiles fp
              WHERE fp.farm_name ILIKE $1 OR fp.description ILIKE $1
              LIMIT 5
            `,
        [searchPattern],
      );
    } catch (_) {
      farms = [];
    }

    // Search products from the in-memory mock list (same data the catalog page uses)
    const allProducts = await this.productsService.findAll();
    const products = allProducts
      .filter(
        (p) =>
          p.name?.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query),
      )
      .slice(0, 5)
      .map((p) => ({ ...p, type: 'product' }));

    // Return farms first, then products (max 10 total)
    return [...farms, ...products].slice(0, 10);
  }
}
