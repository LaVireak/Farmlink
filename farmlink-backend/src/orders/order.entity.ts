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
import { User } from '../users/user.entity';
import { OrderItem } from './order-item.entity';
import { OrderStatus } from '../common/enums/order-status.enum';
import { PaymentMethod, PaymentStatus } from '../common/enums/payment.enum';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'consumer_id' })
  consumer: User;

  @Column({ name: 'consumer_id' })
  consumerId: string;

  @Column({ name: 'order_number', length: 50, unique: true })
  orderNumber: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ name: 'payment_method', type: 'enum', enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @Column({ name: 'payment_status', type: 'enum', enum: PaymentStatus, default: PaymentStatus.UNPAID })
  paymentStatus: PaymentStatus;

  @Column({ name: 'payment_ref', length: 255, nullable: true })
  paymentRef: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  subtotal: number;

  @Column({ name: 'delivery_fee', type: 'decimal', precision: 12, scale: 2, default: 0 })
  deliveryFee: number;

  @Column({ name: 'total_amount', type: 'decimal', precision: 12, scale: 2 })
  totalAmount: number;

  @Column({ name: 'delivery_address', type: 'text', nullable: true })
  deliveryAddress: string;

  @Column({ name: 'delivery_lat', type: 'decimal', precision: 10, scale: 7, nullable: true })
  deliveryLat: number;

  @Column({ name: 'delivery_lng', type: 'decimal', precision: 10, scale: 7, nullable: true })
  deliveryLng: number;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({ name: 'dispute_reason', type: 'text', nullable: true })
  disputeReason: string;

  @Column({ name: 'confirmed_at', type: 'timestamptz', nullable: true })
  confirmedAt: Date;

  @Column({ name: 'delivered_at', type: 'timestamptz', nullable: true })
  deliveredAt: Date;

  @Column({ name: 'cancelled_at', type: 'timestamptz', nullable: true })
  cancelledAt: Date;

  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
