import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from '../products/category.entity';
import { ProductUnit } from '../common/enums/product.enum';

@Entity('seasonal_calendar')
export class SeasonalCalendar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'crop_name_en', length: 150 })
  cropNameEn: string;

  @Column({ name: 'crop_name_km', length: 150, nullable: true })
  cropNameKm: string;

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ name: 'category_id', nullable: true })
  categoryId: string;

  @Column({ name: 'plant_month', type: 'smallint', nullable: true })
  plantMonth: number;

  @Column({ name: 'harvest_month', type: 'smallint', nullable: true })
  harvestMonth: number;

  @Column({ length: 100, nullable: true })
  province: string;

  @Column({ type: 'text', nullable: true })
  tips: string;

  @Column({ name: 'image_url', length: 500, nullable: true })
  imageUrl: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
