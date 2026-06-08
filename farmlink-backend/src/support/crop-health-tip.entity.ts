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

@Entity('crop_health_tips')
export class CropHealthTip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'title_en', length: 255 })
  titleEn: string;

  @Column({ name: 'title_km', length: 255, nullable: true })
  titleKm: string;

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ name: 'category_id', nullable: true })
  categoryId: string;

  @Column({ name: 'problem_type', length: 100, nullable: true })
  problemType: string;

  @Column({ type: 'text', nullable: true })
  symptoms: string;

  @Column({ type: 'text' })
  solutions: string;

  @Column({ name: 'image_url', length: 500, nullable: true })
  imageUrl: string;

  @Column({ name: 'is_published', default: true })
  isPublished: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
