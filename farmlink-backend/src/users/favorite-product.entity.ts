import {
  Entity,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Product } from '../products/product.entity';

@Entity('favorite_products')
@Unique(['consumerId', 'productId'])
export class FavoriteProduct {
  @ManyToOne(() => User, (user) => user.favoriteProducts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'consumer_id' })
  consumer: User;

  @Column({ name: 'consumer_id', primary: true })
  consumerId: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'product_id', primary: true })
  productId: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
