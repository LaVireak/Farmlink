import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { FavoriteFarm } from './favorite-farm.entity';
import { FavoriteProduct } from './favorite-product.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(FavoriteFarm)
    private readonly favoriteFarmRepository: Repository<FavoriteFarm>,
    @InjectRepository(FavoriteProduct)
    private readonly favoriteProductRepository: Repository<FavoriteProduct>,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async updateProfile(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    const updatedUser = this.userRepository.merge(user, updateUserDto);
    return this.userRepository.save(updatedUser);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.userRepository.remove(user);
  }

  // --- Favorites ---

  async getFavoriteFarms(consumerId: string): Promise<FavoriteFarm[]> {
    return this.favoriteFarmRepository.find({ where: { consumerId }, relations: ['farmer'] });
  }

  async addFavoriteFarm(consumerId: string, farmerId: string): Promise<FavoriteFarm> {
    const favorite = this.favoriteFarmRepository.create({ consumerId, farmerId });
    return this.favoriteFarmRepository.save(favorite);
  }

  async removeFavoriteFarm(consumerId: string, farmerId: string): Promise<void> {
    await this.favoriteFarmRepository.delete({ consumerId, farmerId });
  }

  async getFavoriteProducts(consumerId: string): Promise<FavoriteProduct[]> {
    return this.favoriteProductRepository.find({ where: { consumerId }, relations: ['product'] });
  }

  async addFavoriteProduct(consumerId: string, productId: string): Promise<FavoriteProduct> {
    const favorite = this.favoriteProductRepository.create({ consumerId, productId });
    return this.favoriteProductRepository.save(favorite);
  }

  async removeFavoriteProduct(consumerId: string, productId: string): Promise<void> {
    await this.favoriteProductRepository.delete({ consumerId, productId });
  }
}
