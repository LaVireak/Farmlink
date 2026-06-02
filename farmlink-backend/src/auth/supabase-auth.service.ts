import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import {
  createClient,
  type SupabaseClient,
  type User as SupabaseUser,
} from '@supabase/supabase-js';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import WebSocket from 'ws';
import { User } from '../users/user.entity';
import { UserRole } from '../common/enums/role.enum';
import { UserStatus } from '../common/enums/user-status.enum';

type SupabaseMetadata = {
  role?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  farmName?: string;
  address?: string;
  avatarUrl?: string | null;
  avatar_url?: string | null;
};

type ParsedImage = {
  buffer: Buffer;
  mimeType: string;
  ext: string;
};

type UpdateUserByIdAttributes = Parameters<
  SupabaseClient['auth']['admin']['updateUserById']
>[1];

@Injectable()
export class SupabaseAuthService {
  private readonly client: ReturnType<typeof createClient>;
  private readonly avatarBucket: string;

  constructor(
    private readonly config: ConfigService,
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {
    const supabaseUrl = this.config.get<string>('SUPABASE_URL');
    const supabaseKey =
      this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY') ||
      this.config.get<string>('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        'Supabase Auth is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.',
      );
    }

    this.avatarBucket =
      this.config.get<string>('SUPABASE_AVATAR_BUCKET') || 'avatars';

    const realtimeTransport =
      WebSocket as unknown as typeof globalThis.WebSocket;

    this.client = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
      realtime: {
        transport: realtimeTransport,
      },
    });
  }

  async finalizeSignup(
    userId: string,
    payload: { password?: string; metadata?: Record<string, unknown> },
  ) {
    if (!userId) {
      throw new Error('Missing userId');
    }

    const update: UpdateUserByIdAttributes = {};
    if (payload.password) update.password = payload.password;
    if (payload.metadata) update.user_metadata = payload.metadata;

    // Use admin API to update the user using the service role key.
    // This avoids the client-side update which triggers password-change emails.
    // supabase-js exposes admin methods under auth.admin
    const { data, error } = await this.client.auth.admin.updateUserById(
      userId,
      update,
    );
    if (error) {
      throw new Error(error.message || 'Unable to finalize signup');
    }

    if (data?.user) {
      await this.getOrCreateLocalUser(data.user);
    }

    return data;
  }

  async validateToken(accessToken: string): Promise<User> {
    const { data, error } = await this.client.auth.getUser(accessToken);
    if (error || !data?.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return this.getOrCreateLocalUser(data.user);
  }

  async syncUsersFromAuth(): Promise<number> {
    const perPage = 1000;
    let page = 1;
    let total = 0;

    while (true) {
      const { data, error } = await this.client.auth.admin.listUsers({
        page,
        perPage,
      });

      if (error) {
        throw new Error(error.message || 'Unable to list Supabase users');
      }

      const users = data?.users ?? [];
      if (users.length === 0) {
        break;
      }

      for (const user of users) {
        await this.getOrCreateLocalUser(user);
      }

      total += users.length;

      if (users.length < perPage) {
        break;
      }

      page += 1;
    }

    return total;
  }

  async uploadAvatarImage(userId: string, dataUrl: string): Promise<string> {
    const image = this.parseDataUrl(dataUrl);
    const fileName = `${userId}-${Date.now()}.${image.ext}`;
    const storagePath = `users/${fileName}`;

    const { error: uploadError } = await this.client.storage
      .from(this.avatarBucket)
      .upload(storagePath, image.buffer, {
        contentType: image.mimeType,
        upsert: true,
      });

    if (uploadError) {
      throw new Error(uploadError.message || 'Unable to upload avatar');
    }

    const { data } = this.client.storage
      .from(this.avatarBucket)
      .getPublicUrl(storagePath);
    const publicUrl = data?.publicUrl;
    if (!publicUrl) {
      throw new Error('Unable to resolve uploaded avatar URL');
    }

    await this.updateAvatarMetadata(userId, publicUrl);

    return publicUrl;
  }

  async clearAvatarMetadata(userId: string): Promise<void> {
    await this.updateAvatarMetadata(userId, null);
  }

  private async updateAvatarMetadata(
    userId: string,
    avatarUrl: string | null,
  ): Promise<void> {
    const { data, error } = await this.client.auth.admin.getUserById(userId);
    if (error) {
      throw new Error(error.message || 'Unable to load Supabase user');
    }

    const currentMetadata = (data.user?.user_metadata ??
      {}) as SupabaseMetadata;
    const nextMetadata: SupabaseMetadata = {
      ...currentMetadata,
    };

    if (avatarUrl === null) {
      nextMetadata.avatarUrl = null;
      nextMetadata.avatar_url = null;
    } else {
      nextMetadata.avatarUrl = avatarUrl;
      nextMetadata.avatar_url = avatarUrl;
    }

    const update: UpdateUserByIdAttributes = {
      user_metadata: nextMetadata,
    };

    const { error: updateError } = await this.client.auth.admin.updateUserById(
      userId,
      update,
    );

    if (updateError) {
      throw new Error(
        updateError.message || 'Unable to update Supabase avatar metadata',
      );
    }
  }

  private async getOrCreateLocalUser(
    supabaseUser: SupabaseUser,
  ): Promise<User> {
    const metadata = (supabaseUser.user_metadata ?? {}) as SupabaseMetadata;
    const email = (supabaseUser.email ?? '').toLowerCase().trim();
    const syntheticEmail = `no-email-${supabaseUser.id}@supabase.local`;

    let user = await this.users.findOne({
      where: { id: supabaseUser.id },
    });

    if (!user && email) {
      user = await this.users.findOne({
        where: { email },
      });
    }

    if (!user) {
      const passwordHash = await bcrypt.hash(
        randomBytes(32).toString('hex'),
        10,
      );
      user = new User();
      user.id = supabaseUser.id;
      user.email = email || syntheticEmail;
      user.passwordHash = passwordHash;
      user.role = this.normalizeRole(metadata.role);
      user.status = UserStatus.ACTIVE;
      user.firstName = metadata.firstName ?? null;
      user.lastName = metadata.lastName ?? null;
      user.phoneNumber = metadata.phone ?? null;
      user.avatarUrl = metadata.avatarUrl ?? metadata.avatar_url ?? null;

      return this.users.save(user);
    }

    let shouldSave = false;

    if (email && user.email !== email) {
      user.email = email;
      shouldSave = true;
    }

    const nextRole = this.normalizeRole(metadata.role);
    if (user.role !== nextRole) {
      user.role = nextRole;
      shouldSave = true;
    }

    if (!user.firstName && metadata.firstName) {
      user.firstName = metadata.firstName;
      shouldSave = true;
    }

    if (!user.lastName && metadata.lastName) {
      user.lastName = metadata.lastName;
      shouldSave = true;
    }

    if (!user.phoneNumber && metadata.phone) {
      user.phoneNumber = metadata.phone;
      shouldSave = true;
    }

    if (!user.avatarUrl && metadata.avatarUrl) {
      user.avatarUrl = metadata.avatarUrl;
      shouldSave = true;
    }
    const incomingRole = this.normalizeRole(metadata.role);
    if (incomingRole && user.role !== incomingRole) {
      user.role = incomingRole;
      shouldSave = true;
    }
    if (user.status !== UserStatus.ACTIVE) {
      user.status = UserStatus.ACTIVE;
      shouldSave = true;
    }

    return shouldSave ? this.users.save(user) : user;
  }

  private normalizeRole(role?: string): UserRole {
    const normalized = role === 'customer' ? 'consumer' : role;

    switch (normalized) {
      case UserRole.ADMIN:
      case UserRole.FARMER:
      case UserRole.CONSUMER:
      case UserRole.BUYER:
        return normalized;
      default:
        return UserRole.CONSUMER;
    }
  }

  private parseDataUrl(dataUrl: string): ParsedImage {
    const match = /^data:([^;]+);base64,(.*)$/.exec(dataUrl);
    if (!match) {
      throw new UnauthorizedException('Invalid avatar payload');
    }

    const mimeType = match[1];
    const base64Data = match[2];
    const ext = this.resolveExtension(mimeType);

    return {
      buffer: Buffer.from(base64Data, 'base64'),
      mimeType,
      ext,
    };
  }

  private resolveExtension(mimeType: string): string {
    const map: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/gif': 'gif',
    };

    return map[mimeType] ?? 'jpg';
  }
}
