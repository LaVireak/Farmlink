import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

@Injectable()
export class SearchService {
    constructor(@InjectDataSource() private db: DataSource) { }

    async search(q: string) {
        const results = await this.db.query(`
      SELECT 
        fp.id,
        fp.farm_name AS name,
        fp.description,
        fp.province AS category,
        fp.cover_image_url AS image,
        'farm' AS type
      FROM farmer_profiles fp
      WHERE fp.farm_name ILIKE $1 OR fp.description ILIKE $1

      UNION ALL

      SELECT 
        p.id,
        p.name_en AS name,
        p.description,
        c.name_en AS category,
        p.thumbnail_url AS image,
        'product' AS type
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.name_en ILIKE $1 OR c.name_en ILIKE $1
      AND p.status = 'active'

      ORDER BY type, name
      LIMIT 10
    `, [`%${q}%`])

        return results
    }
}