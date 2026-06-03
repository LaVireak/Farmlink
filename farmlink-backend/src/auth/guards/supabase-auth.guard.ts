import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
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
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();
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

    request.user = await this.supabaseAuth.validateToken(token);
    return true;
  }
}
