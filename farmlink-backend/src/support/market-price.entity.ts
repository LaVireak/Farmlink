import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from '../products/category.entity';
import { ProductUnit } from '../common/enums/product.enum';

@Entity('market_prices')
export class MarketPrice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'product_name', length: 200 })
  productName: string;

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ name: 'category_id', nullable: true })
  categoryId: string;

  @Column({ name: 'market_name', length: 200, nullable: true })
  marketName: string;

  @Column({ length: 100, nullable: true })
  province: string;

  @Column({ name: 'price_low', type: 'decimal', precision: 10, scale: 2 })
  priceLow: number;

  @Column({ name: 'price_high', type: 'decimal', precision: 10, scale: 2 })
  priceHigh: number;

  @Column({ type: 'enum', enum: ProductUnit, default: ProductUnit.KG })
  unit: ProductUnit;

  @Column({ name: 'date_recorded', type: 'date' })
  dateRecorded: Date;

  @Column({ length: 255, nullable: true })
  source: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
