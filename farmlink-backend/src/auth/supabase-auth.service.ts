import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { createClient, type SupabaseClient, type User as SupabaseUser } from '@supabase/supabase-js';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import ws from 'ws';
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
  avatarUrl?: string;
};

@Injectable()
export class SupabaseAuthService {
  private readonly client: SupabaseClient;

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
      throw new Error('Supabase Auth is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
    }

    this.client = createClient(supabaseUrl, supabaseKey, {
      realtime: {
        transport: ws,
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });
  }

  async finalizeSignup(userId: string, payload: { password?: string; metadata?: Record<string, unknown> }) {
    if (!userId) {
      throw new Error('Missing userId');
    }

    const update: Record<string, unknown> = {};
    if (payload.password) update['password'] = payload.password;
    if (payload.metadata) update['user_metadata'] = payload.metadata;

    // Use admin API to update the user using the service role key.
    // This avoids the client-side update which triggers password-change emails.
    // supabase-js exposes admin methods under auth.admin
    const { data, error } = await this.client.auth.admin.updateUserById(userId, update as any);
    if (error) {
      throw new Error(error.message || 'Unable to finalize signup');
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

  private async getOrCreateLocalUser(supabaseUser: SupabaseUser): Promise<User> {
    const metadata = (supabaseUser.user_metadata ?? {}) as SupabaseMetadata;
    const email = (supabaseUser.email ?? '').toLowerCase();

    if (!email) {
      throw new UnauthorizedException('Supabase user missing email');
    }

    let user = await this.users.findOne({
      where: { email },
    });

    if (!user) {
      const passwordHash = await bcrypt.hash(randomBytes(32).toString('hex'), 10);
      user = new User();
      user.email = email;
      user.passwordHash = passwordHash;
      user.role = this.normalizeRole(metadata.role);
      user.status = UserStatus.ACTIVE;
      user.firstName = metadata.firstName ?? null;
      user.lastName = metadata.lastName ?? null;
      user.phoneNumber = metadata.phone ?? null;
      user.avatarUrl = metadata.avatarUrl ?? null;

      return this.users.save(user);
    }

    let shouldSave = false;

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
}
