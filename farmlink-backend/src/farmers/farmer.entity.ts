import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';

@Entity('farmer_profiles')
export class FarmerProfile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'user_id' })
  userId!: string;

  @Column({ name: 'farm_name', length: 255 })
  farmName!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ length: 100, nullable: true })
  province!: string;

  @Column({ length: 100, nullable: true })
  district!: string;

  @Column({ name: 'address_detail', type: 'text', nullable: true })
  addressDetail!: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude!: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude!: number;

  @Column({ name: 'cover_image_url', length: 500, nullable: true })
  coverImageUrl!: string;

  @Column({ name: 'id_document_url', length: 500, nullable: true })
  idDocumentUrl!: string;

  @Column({ name: 'farm_deed_url', length: 500, nullable: true })
  farmDeedUrl!: string;

  @Column({ name: 'product_tags', type: 'text', nullable: true })
  productTags!: string;

  @Column({ name: 'is_verified', default: false })
  isVerified!: boolean;

  @Column({ name: 'verified_at', type: 'timestamptz', nullable: true })
  verifiedAt!: Date;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'verified_by' })
  verifiedByUser!: User;

  @Column({ name: 'verified_by', type: 'uuid', nullable: true })
  verifiedBy!: string;

  @Column({ name: 'total_sales', default: 0 })
  totalSales!: number;

  @Column({
    name: 'avg_rating',
    type: 'decimal',
    precision: 3,
    scale: 2,
    nullable: true,
  })
  avgRating!: number;

  @Column({ name: 'match_status', length: 50, default: 'Unmatched' })
  matchStatus!: string;

  @Column({ name: 'matched_buyer_id', type: 'uuid', nullable: true })
  matchedBuyerId!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => Product, (product) => product.farmer)
  products: Product[];
}
