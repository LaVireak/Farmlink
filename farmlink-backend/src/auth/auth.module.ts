import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { EmailOtp } from './email-otp.entity';
import { RefreshToken } from './refresh-token.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GmailMailerService } from './gmail-mailer.service';

const parseDurationToSeconds = (value: string): number => {
  const raw = value.trim();
  if (/^\d+$/.test(raw)) {
    return Number(raw);
  }
  const match = /^(\d+)([smhd])$/.exec(raw);
  if (!match) return 0;

  const amount = Number(match[1]);
  const unit = match[2];

  switch (unit) {
    case 's':
      return amount;
    case 'm':
      return amount * 60;
    case 'h':
      return amount * 60 * 60;
    case 'd':
      return amount * 24 * 60 * 60;
    default:
      return 0;
  }
};

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, RefreshToken, EmailOtp]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const ttl = config.get<string>('JWT_ACCESS_TTL', '15m');
        const expiresIn = parseDurationToSeconds(ttl) || 900;
        return {
          secret: config.get<string>('JWT_ACCESS_SECRET', 'dev-access-secret'),
          signOptions: {
            expiresIn,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    GmailMailerService, 
  ],
  exports: [AuthService],
})
export class AuthModule {}