import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { FarmerProfile } from '../farmers/farmer.entity';
import { Category } from './category.entity';
import { ProductUnit, ProductStatus } from '../common/enums/product.enum';
import { ProductImage } from './product-image.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => FarmerProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'farmer_id' })
  farmer: FarmerProfile;

  @Column({ name: 'farmer_id' })
  farmerId: string;

  @ManyToOne(() => Category, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ name: 'category_id', nullable: true })
  categoryId: string;

  @Column({ name: 'name_en', length: 255 })
  nameEn: string;

  @Column({ name: 'name_km', length: 255, nullable: true })
  nameKm: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'price_per_unit', type: 'decimal', precision: 10, scale: 2 })
  pricePerUnit: number;

  @Column({ type: 'enum', enum: ProductUnit, default: ProductUnit.KG })
  unit: ProductUnit;

  @Column({ name: 'stock_quantity', default: 0 })
  stockQuantity: number;

  @Column({ name: 'min_order_qty', default: 1 })
  minOrderQty: number;

  @Column({ name: 'is_seasonal', default: false })
  isSeasonal: boolean;

  @Column({ name: 'season_start', type: 'date', nullable: true })
  seasonStart: Date;

  @Column({ name: 'season_end', type: 'date', nullable: true })
  seasonEnd: Date;

  @Column({ name: 'is_organic', default: false })
  isOrganic: boolean;

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.PENDING_REVIEW,
  })
  status: ProductStatus;

  @Column({ name: 'thumbnail_url', length: 500, nullable: true })
  thumbnailUrl: string;

  @Column({ name: 'total_sold', default: 0 })
  totalSold: number;

  @Column({
    name: 'avg_rating',
    type: 'decimal',
    precision: 3,
    scale: 2,
    nullable: true,
  })
  avgRating: number;

  @OneToMany(() => ProductImage, (image) => image.product)
  images: ProductImage[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
