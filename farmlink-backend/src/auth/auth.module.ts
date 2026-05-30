import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { SupabaseAuthService } from './supabase-auth.service';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
  ],
  providers: [SupabaseAuthService, SupabaseAuthGuard],
  controllers: [AuthController],
  exports: [SupabaseAuthService, SupabaseAuthGuard],
})
export class AuthModule { }