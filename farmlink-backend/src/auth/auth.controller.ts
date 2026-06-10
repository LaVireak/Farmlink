import { Body, Controller, Post } from '@nestjs/common';
import { SupabaseAuthService } from './supabase-auth.service';
import { Public } from './decorators/public.decorator';

type FinalizeDto = {
  userId: string;
  password?: string;
  metadata?: Record<string, unknown>;
};

@Controller('auth')
export class AuthController {
  constructor(private readonly supabaseAuth: SupabaseAuthService) {}

  @Public()
  @Post('finalize-signup')
  async finalizeSignup(@Body() body: FinalizeDto) {
    const { userId, password, metadata } = body;
    await this.supabaseAuth.finalizeSignup(userId, { password, metadata });
    return { message: 'Signup finalized' };
  }
}
