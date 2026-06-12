import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { SupabaseAuthService } from '../supabase-auth.service';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly supabaseAuth: SupabaseAuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    if (request.method === 'OPTIONS') {
      return true;
    }

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const header = request.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      // Don't throw immediately, we might have a query token
    }

    let token = request.headers.authorization?.slice('Bearer '.length).trim();
    if (!token && request.query.token) {
      token = request.query.token as string;
    }
    if (!token) {
      throw new UnauthorizedException('Missing or invalid token');
    }

    const user = await this.supabaseAuth.validateToken(token);
    if (user.status && user.status.toLowerCase() === 'suspended') {
      throw new ForbiddenException('Your account has been suspended');
    }
    request.user = user;
    return true;
  }
}
