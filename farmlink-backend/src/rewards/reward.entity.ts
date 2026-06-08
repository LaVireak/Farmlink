import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { RewardTransaction } from './reward-transaction.entity';

@Entity('rewards')
export class Reward {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'consumer_id' })
  consumer: User;

  @Column({ name: 'consumer_id', unique: true })
  consumerId: string;

  @Column({ name: 'points_balance', default: 0 })
  pointsBalance: number;

  @Column({ name: 'total_earned', default: 0 })
  totalEarned: number;

  @Column({ name: 'total_redeemed', default: 0 })
  totalRedeemed: number;

  @Column({ length: 50, default: 'bronze' })
  tier: string;

  @OneToMany(() => RewardTransaction, (tx) => tx.reward)
  transactions: RewardTransaction[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
