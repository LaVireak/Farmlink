import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Check,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';
import { FarmerProfile } from '../farmers/farmer.entity';
import { Order } from '../orders/order.entity';

@Entity('reviews')
@Check(`"rating" BETWEEN 1 AND 5`)
@Check('review_target_check', `"product_id" IS NOT NULL OR "farmer_id" IS NOT NULL`)
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'consumer_id' })
  consumer: User;

  @Column({ name: 'consumer_id' })
  consumerId: string;

  @ManyToOne(() => Product, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'product_id', nullable: true })
  productId: string;

  @ManyToOne(() => FarmerProfile, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'farmer_id' })
  farmer: FarmerProfile;

  @Column({ name: 'farmer_id', nullable: true })
  farmerId: string;

  @ManyToOne(() => Order, { nullable: true })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'order_id', nullable: true })
  orderId: string;

  @Column({ type: 'smallint' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ name: 'is_visible', default: true })
  isVisible: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
