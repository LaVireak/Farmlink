import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import * as fs from 'fs/promises';
import * as path from 'path';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { FavoriteFarm } from './favorite-farm.entity';
import { FavoriteProduct } from './favorite-product.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    @InjectRepository(FavoriteFarm)
    private readonly favoriteFarms: Repository<FavoriteFarm>,
    @InjectRepository(FavoriteProduct)
    private readonly favoriteProducts: Repository<FavoriteProduct>,
  ) {}

  // ── Find ────────────────────────────────────────────────────────────────

  async findAll(): Promise<User[]> {
    return this.users.find({ order: { createdAt: 'DESC' } });
  }

  async findById(id: string): Promise<User> {
    const user = await this.users.findOne({
      where: { id },
      relations: ['farmerProfile'],
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // ── Update profile ───────────────────────────────────────────────────────
  // PATCH /users/profile
  // Accepts: firstName, lastName, phoneNumber, languagePref
  // Also accepts avatarDataUrl (base64) — saves to disk and updates avatarUrl

  async updateProfile(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    if (dto.firstName   !== undefined) user.firstName   = dto.firstName;
    if (dto.lastName    !== undefined) user.lastName     = dto.lastName;
    if (dto.phoneNumber !== undefined) user.phoneNumber  = dto.phoneNumber;
    if (dto.languagePref !== undefined) user.languagePref = dto.languagePref;

    // Direct URL (e.g. external provider)
    if (dto.avatarUrl !== undefined) {
      user.avatarUrl = dto.avatarUrl;
    }

    // Base64 data URL — save to disk
    if (dto.avatarDataUrl) {
      const avatarUrl = await this.saveDataUrlImage(dto.avatarDataUrl, 'avatars');
      user.avatarUrl = avatarUrl;
    }

    return this.users.save(user);
  }

  // ── Remove ───────────────────────────────────────────────────────────────

  async remove(id: string): Promise<{ message: string }> {
    const user = await this.findById(id);
    await this.users.remove(user);
    return { message: 'User deleted' };
  }

  // ── Favorites: Farms ─────────────────────────────────────────────────────

  async getFavoriteFarms(userId: string) {
    return this.favoriteFarms.find({
      where: { consumerId: userId },
      relations: ['farm'],
    });
  }

  async addFavoriteFarm(userId: string, farmerId: string) {
    const exists = await this.favoriteFarms.findOne({
      where: { consumerId: userId, farmId: farmerId },
    });
    if (exists) return exists;
    const fav = this.favoriteFarms.create({ consumerId: userId, farmId: farmerId });
    return this.favoriteFarms.save(fav);
  }

  async removeFavoriteFarm(userId: string, farmerId: string) {
    const fav = await this.favoriteFarms.findOne({
      where: { consumerId: userId, farmId: farmerId },
    });
    if (!fav) throw new NotFoundException('Favorite not found');
    await this.favoriteFarms.remove(fav);
    return { message: 'Removed' };
  }

  // ── Favorites: Products ───────────────────────────────────────────────────

  async getFavoriteProducts(userId: string) {
    return this.favoriteProducts.find({
      where: { consumerId: userId },
      relations: ['product'],
    });
  }

  async addFavoriteProduct(userId: string, productId: string) {
    const exists = await this.favoriteProducts.findOne({
      where: { consumerId: userId, productId },
    });
    if (exists) return exists;
    const fav = this.favoriteProducts.create({ consumerId: userId, productId });
    return this.favoriteProducts.save(fav);
  }

  async removeFavoriteProduct(userId: string, productId: string) {
    const fav = await this.favoriteProducts.findOne({
      where: { consumerId: userId, productId },
    });
    if (!fav) throw new NotFoundException('Favorite not found');
    await this.favoriteProducts.remove(fav);
    return { message: 'Removed' };
  }

  // ── Image helper ──────────────────────────────────────────────────────────

  private async saveDataUrlImage(dataUrl: string, folder: string): Promise<string> {
    const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl);
    if (!match) throw new Error('Invalid image data URL');

    const mimeType = match[1];
    const base64   = match[2];
    const buffer   = Buffer.from(base64, 'base64');

    const extMap: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png':  'png',
      'image/webp': 'webp',
      'image/gif':  'gif',
    };
    const ext = extMap[mimeType] ?? 'jpg';

    const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '') || 'uploads';
    const fileName   = `${Date.now()}-${randomUUID()}.${ext}`;
    const targetDir  = path.join(process.cwd(), 'uploads', safeFolder);

    await fs.mkdir(targetDir, { recursive: true });
    await fs.writeFile(path.join(targetDir, fileName), buffer);

    return path.join('uploads', safeFolder, fileName).replace(/\\/g, '/');
  }
}