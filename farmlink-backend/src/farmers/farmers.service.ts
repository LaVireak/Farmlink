import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Repository } from 'typeorm';
import { UserRole } from '../common/enums/role.enum';
import { UserStatus } from '../common/enums/user-status.enum';
import { User } from '../users/user.entity';
import {
  CreateFarmerOnboardingDto,
  UploadedImageDto,
} from './dto/create-farmer.dto';
import { FarmerProfile } from './farmer.entity';

@Injectable()
export class FarmersService {
  constructor(
    @InjectRepository(FarmerProfile)
    private readonly farmerProfiles: Repository<FarmerProfile>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  async submitOnboarding(dto: CreateFarmerOnboardingDto) {
    const user = await this.users.findOne({ where: { email: dto.email } });
    if (!user) {
      throw new NotFoundException('Farmer account not found');
    }
    if (user.role !== UserRole.FARMER) {
      throw new BadRequestException('User is not a farmer');
    }
    if (user.status !== UserStatus.ACTIVE) {
      throw new BadRequestException('Farmer account is not verified');
    }

    if (dto.phone) {
      user.phoneNumber = dto.phone;
    }

    let profile = await this.farmerProfiles.findOne({
      where: { userId: user.id },
    });
    if (!profile) {
      profile = this.farmerProfiles.create({
        userId: user.id,
        farmName:
          dto.farmName?.trim() ||
          `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() ||
          'Farm',
      });
    }

    if (dto.address) {
      profile.addressDetail = dto.address;
    }

    if (dto.tags?.length) {
      profile.productTags = JSON.stringify(dto.tags);
    }

    if (dto.idPhoto) {
      profile.idDocumentUrl = await this.saveImage(dto.idPhoto, 'farmers');
    }

    if (dto.farmDeed) {
      profile.farmDeedUrl = await this.saveImage(dto.farmDeed, 'farmers');
    }

    if (dto.profilePhoto) {
      const avatarUrl = await this.saveImage(dto.profilePhoto, 'avatars');
      user.avatarUrl = avatarUrl;
      profile.coverImageUrl = avatarUrl;
    }

    await this.users.save(user);
    const savedProfile = await this.farmerProfiles.save(profile);

    return {
      message: 'Farmer onboarding saved',
      profile: savedProfile,
    };
  }

  private async saveImage(
    file: UploadedImageDto,
    folder: string,
  ): Promise<string> {
    const { buffer, ext } = this.parseDataUrl(file);
    const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '') || 'uploads';
    const fileName = `${Date.now()}-${randomUUID()}.${ext}`;
    const targetDir = path.join(process.cwd(), 'uploads', safeFolder);

    await fs.mkdir(targetDir, { recursive: true });
    await fs.writeFile(path.join(targetDir, fileName), buffer);

    return path.join('uploads', safeFolder, fileName).replace(/\\/g, '/');
  }

  private parseDataUrl(file: UploadedImageDto): {
    buffer: Buffer;
    ext: string;
  } {
    const match = /^data:([^;]+);base64,(.*)$/.exec(file.dataUrl);
    if (!match) {
      throw new BadRequestException('Invalid image payload');
    }

    const mimeType = match[1];
    const base64Data = match[2];
    const buffer = Buffer.from(base64Data, 'base64');
    const ext = this.resolveExtension(mimeType, file.name);

    return { buffer, ext };
  }

  private resolveExtension(mimeType: string, name: string): string {
    const map: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/gif': 'gif',
    };

    if (map[mimeType]) {
      return map[mimeType];
    }

    const fallback = name.split('.').pop();
    return fallback ? fallback.toLowerCase() : 'jpg';
  }
}
