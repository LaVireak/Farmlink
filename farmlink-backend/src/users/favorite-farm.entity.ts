import {
  Entity,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { FarmerProfile } from '../farmers/farmer.entity';

@Entity('favorite_farms')
@Unique(['consumerId', 'farmerId'])
export class FavoriteFarm {
  @ManyToOne(() => User, (user) => user.favoriteFarms, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'consumer_id' })
  consumer: User;

  @Column({ name: 'consumer_id', primary: true })
  consumerId: string;

  @ManyToOne(() => FarmerProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'farmer_id' })
  farmer: FarmerProfile;

  @Column({ name: 'farmer_id', primary: true })
  farmerId: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
