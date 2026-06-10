import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { FavoriteFarm } from './favorite-farm.entity';
import { FavoriteProduct } from './favorite-product.entity';
import { SupabaseAuthService } from '../auth/supabase-auth.service';
import { FarmerProfile } from '../farmers/farmer.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(FavoriteFarm)
    private readonly favoriteFarmRepository: Repository<FavoriteFarm>,
    @InjectRepository(FavoriteProduct)
    private readonly favoriteProductRepository: Repository<FavoriteProduct>,
    private readonly supabaseAuthService: SupabaseAuthService,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['farmerProfile'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Auto-create/initialize farmer profile if user role is farmer but profile is null
    if (user.role === 'farmer' && !user.farmerProfile) {
      try {
        const farmerRepo =
          this.userRepository.manager.getRepository(FarmerProfile);
        const newProfile = farmerRepo.create({
          userId: user.id,
          farmName:
            `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() ||
            'My Local Farm',
          addressDetail: 'Phnom Penh, Cambodia',
          isVerified: true,
          matchStatus: 'approved',
        });
        user.farmerProfile = await farmerRepo.save(newProfile);
      } catch (err) {
        console.error('Failed to auto-create farmer profile:', err);
      }
    }

    return user;
  }

  async updateProfile(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    const { avatarDataUrl, avatarUrl, ...profileUpdates } = updateUserDto;
    const updatedUser = this.userRepository.merge(user, profileUpdates);

    const stagedAvatarDataUrl =
      avatarDataUrl ?? (this.isDataUrl(avatarUrl) ? avatarUrl : undefined);

    if (avatarUrl && !this.isDataUrl(avatarUrl)) {
      updatedUser.avatarUrl = avatarUrl;
    }

    if (stagedAvatarDataUrl) {
      updatedUser.avatarUrl = await this.supabaseAuthService.uploadAvatarImage(
        id,
        stagedAvatarDataUrl,
      );
    }

    const savedUser = await this.userRepository.save(updatedUser);
    return savedUser;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.userRepository.remove(user);
  }

  private isDataUrl(value?: string): value is string {
    return typeof value === 'string' && value.startsWith('data:');
  }

  // --- Favorites ---

  async getFavoriteFarms(consumerId: string): Promise<FavoriteFarm[]> {
    return this.favoriteFarmRepository.find({
      where: { consumerId },
      relations: ['farmer'],
    });
  }

  async addFavoriteFarm(
    consumerId: string,
    farmerId: string,
  ): Promise<FavoriteFarm> {
    const favorite = this.favoriteFarmRepository.create({
      consumerId,
      farmerId,
    });
    return this.favoriteFarmRepository.save(favorite);
  }

  async removeFavoriteFarm(
    consumerId: string,
    farmerId: string,
  ): Promise<void> {
    await this.favoriteFarmRepository.delete({ consumerId, farmerId });
  }

  async getFavoriteProducts(consumerId: string): Promise<FavoriteProduct[]> {
    return this.favoriteProductRepository.find({
      where: { consumerId },
      relations: ['product'],
    });
  }

  async addFavoriteProduct(
    consumerId: string,
    productId: string,
  ): Promise<FavoriteProduct> {
    const favorite = this.favoriteProductRepository.create({
      consumerId,
      productId,
    });
    return this.favoriteProductRepository.save(favorite);
  }

  async removeFavoriteProduct(
    consumerId: string,
    productId: string,
  ): Promise<void> {
    await this.favoriteProductRepository.delete({ consumerId, productId });
  }
}
