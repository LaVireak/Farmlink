import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Reward } from './reward.entity';
import { User } from '../users/user.entity';
import { Order } from '../orders/order.entity';
import { RewardEvent } from '../common/enums/reward-event.enum';

@Entity('reward_transactions')
export class RewardTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Reward, reward => reward.transactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reward_id' })
  reward: Reward;

  @Column({ name: 'reward_id' })
  rewardId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'consumer_id' })
  consumer: User;

  @Column({ name: 'consumer_id' })
  consumerId: string;

  @Column({ type: 'enum', enum: RewardEvent })
  event: RewardEvent;

  @Column({ type: 'integer' })
  points: number;

  @ManyToOne(() => Order, { nullable: true })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'order_id', nullable: true })
  orderId: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
