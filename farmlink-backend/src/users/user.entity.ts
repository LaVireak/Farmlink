import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { UserRole } from '../common/enums/role.enum';
import { UserStatus } from '../common/enums/user-status.enum';
import { FarmerProfile } from '../farmers/farmer.entity';
import { FavoriteFarm } from './favorite-farm.entity';
import { FavoriteProduct } from './favorite-product.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ name: 'password_hash', length: 255 })
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CONSUMER,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING,
  })
  status: UserStatus;

  @Column('varchar', { name: 'first_name', length: 100, nullable: true })
  firstName: string | null;

  @Column('varchar', { name: 'last_name', length: 100, nullable: true })
  lastName: string | null;

  @Column('varchar', { name: 'phone_number', length: 30, nullable: true })
  phoneNumber: string | null;

  @Column('varchar', { name: 'avatar_url', length: 500, nullable: true })
  avatarUrl: string | null;

  @Column('varchar', { name: 'language_pref', length: 5, default: 'kh' })
  languagePref: string;

  @Column('varchar', { name: 'stripe_customer_id', nullable: true, length: 255 })
  stripeCustomerId: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @OneToOne(() => FarmerProfile, (farmerProfile) => farmerProfile.user)
  farmerProfile: FarmerProfile;

  @OneToMany(() => FavoriteFarm, (favoriteFarm) => favoriteFarm.consumer)
  favoriteFarms: FavoriteFarm[];

  @OneToMany(() => FavoriteProduct, (favoriteProduct) => favoriteProduct.consumer)
  favoriteProducts: FavoriteProduct[];
}
