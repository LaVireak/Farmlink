import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '../products/product.entity';

@Entity('cart_items')
@Unique(['cartId', 'productId'])
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart!: Cart;

  @Column({ name: 'cart_id' })
  cartId!: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product!: Product;

  @Column({ name: 'product_id' })
  productId!: string;

  @Column({ default: 1 })
  quantity!: number;

  @CreateDateColumn({ name: 'added_at', type: 'timestamptz' })
  addedAt!: Date;
}
