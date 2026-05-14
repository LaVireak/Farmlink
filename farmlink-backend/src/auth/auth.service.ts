import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { randomBytes, randomInt } from 'crypto';
import { IsNull, Repository } from 'typeorm';
import { UserRole } from '../common/enums/role.enum';
import { UserStatus } from '../common/enums/user-status.enum';
import { User } from '../users/user.entity';
import { EmailOtp, OtpPurpose } from './email-otp.entity';
import { RefreshToken } from './refresh-token.entity';
import { SignupDto } from './dto/signup.dto';
import { ResendSignupOtpDto } from './dto/resend-signup-otp.dto';
import { SignInDto } from './dto/signin.dto';
import { VerifySignupOtpDto } from './dto/verify-signup-otp.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { GmailMailerService } from './gmail-mailer.service';
import { GoogleSignInDto } from './dto/google-signin.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResendResetOtpDto } from './dto/resend-reset-otp.dto';
import { VerifyResetOtpDto } from './dto/verify-reset-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

const OTP_CODE_LENGTH = 6;

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const parseDurationToMs = (value: string): number => {
    const raw = value.trim();
    if(/^\d+$/.test(raw)) {
        return Number(raw)*1000;
    }
    const match = /^(\d+)([smhd])$/.exec(raw);
    if(!match) return 0;

    const amount = Number(match[1]);
    const unit = match[2];
    switch(unit) {
        case 's': return amount * 1000;
        case 'm': return amount * 60 * 1000;
        case 'h': return amount * 60 * 60 * 1000;
        case 'd': return amount * 24 * 60 * 60 * 1000;
        default: return 0;
    }
};

type GoogleTokenInfo = {
    aud?: string;
    email?: string;
    email_verified?: string | boolean;
    given_name?: string;
    family_name?: string;
    picture?: string;
};

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly users: Repository<User>,

        @InjectRepository(RefreshToken)
        private readonly refreshTokens: Repository<RefreshToken>,

        @InjectRepository(EmailOtp)
        private readonly otps: Repository<EmailOtp>,
        private readonly jwt: JwtService,
        private readonly mailer: GmailMailerService, // Updated name
        private readonly config: ConfigService
    ) {}

    async requestSignupOtp(dto: SignupDto) {
        const email = normalizeEmail(dto.email);
        const existing = await this.users.findOne({ where: { email } });

        if (existing && existing.status === UserStatus.ACTIVE) {
            throw new ConflictException('Email already registered');
        }

        let user = existing;
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const role = dto.role ?? UserRole.CONSUMER;

        if (!user) {
            user = this.users.create({
                email,
                passwordHash,
                role,
                status: UserStatus.PENDING,
                firstName: dto.firstName,
                lastName: dto.lastName,
            });
        } else {
            user.passwordHash = passwordHash;
            user.role = user.role ?? role;
            user.firstName = dto.firstName ?? user.firstName;
            user.lastName = dto.lastName ?? user.lastName;
            user.status = UserStatus.PENDING;
        }
        await this.users.save(user);

        const code = await this.createOtp(email, OtpPurpose.SIGNUP);
        await this.mailer.sendOtpEmail(email, code);

        return { message: 'OTP sent' };
    }

    async resendSignupOtp(dto: ResendSignupOtpDto) {
        const email = normalizeEmail(dto.email);
        const user = await this.users.findOne({ where: { email } });
        if (!user) {
            throw new NotFoundException('Account not found');
        }
        if (user.status !== UserStatus.PENDING) {
            throw new BadRequestException('Account is already verified');
        }

        await this.assertResendAllowed(email, OtpPurpose.SIGNUP);

        const code = await this.createOtp(email, OtpPurpose.SIGNUP);
        await this.mailer.sendOtpEmail(email, code);

        return { message: 'OTP resent' };
    }

    async verifySignupOtp(dto: VerifySignupOtpDto) {
        const email = normalizeEmail(dto.email);
        const user = await this.users.findOne({ where: { email } });

        if (!user) {
            throw new NotFoundException('Account not found');
        }

        const otp = await this.otps.findOne({
            where: {
                email,
                purpose: OtpPurpose.SIGNUP,
                consumedAt: IsNull(),
            },
            order: { createdAt: 'DESC' },
        });

        if (!otp) {
            throw new BadRequestException('Verification code not found');
        }
        if (otp.expiresAt <= new Date()) {
            throw new BadRequestException('Verification code expired');
        }
        if (otp.attempts >= otp.maxAttempts) {
            throw new BadRequestException('Too many attempts');
        }

        const matches = await bcrypt.compare(dto.code, otp.codeHash);
        if (!matches) {
            otp.attempts += 1;
            await this.otps.save(otp);
            throw new BadRequestException('Invalid verification code');
        }

        otp.consumedAt = new Date();
        await this.otps.save(otp);

        user.status = UserStatus.ACTIVE;
        await this.users.save(user);

        return this.issueTokens(user);
    }

    async requestPasswordResetOtp(dto: ForgotPasswordDto) {
        const email = normalizeEmail(dto.email);
        const user = await this.users.findOne({ where: { email } });

        if (!user) {
            throw new NotFoundException('Account not found');
        }
        if (user.status !== UserStatus.ACTIVE) {
            throw new BadRequestException('Account not verified');
        }

        const code = await this.createOtp(email, OtpPurpose.RESET_PASSWORD);
        await this.mailer.sendOtpEmail(email, code);

        return { message: 'OTP sent' };
    }

    async resendPasswordResetOtp(dto: ResendResetOtpDto) {
        const email = normalizeEmail(dto.email);
        const user = await this.users.findOne({ where: { email } });

        if (!user) {
            throw new NotFoundException('Account not found');
        }
        if (user.status !== UserStatus.ACTIVE) {
            throw new BadRequestException('Account not verified');
        }

        await this.assertResendAllowed(email, OtpPurpose.RESET_PASSWORD);

        const code = await this.createOtp(email, OtpPurpose.RESET_PASSWORD);
        await this.mailer.sendOtpEmail(email, code);

        return { message: 'OTP resent' };
    }

    async verifyPasswordResetOtp(dto: VerifyResetOtpDto) {
        const email = normalizeEmail(dto.email);
        const user = await this.users.findOne({ where: { email } });

        if (!user) {
            throw new NotFoundException('Account not found');
        }

        const otp = await this.otps.findOne({
            where: {
                email,
                purpose: OtpPurpose.RESET_PASSWORD,
                consumedAt: IsNull(),
            },
            order: { createdAt: 'DESC' },
        });

        if (!otp) {
            throw new BadRequestException('Verification code not found');
        }
        if (otp.expiresAt <= new Date()) {
            throw new BadRequestException('Verification code expired');
        }
        if (otp.attempts >= otp.maxAttempts) {
            throw new BadRequestException('Too many attempts');
        }

        const matches = await bcrypt.compare(dto.code, otp.codeHash);
        if (!matches) {
            otp.attempts += 1;
            await this.otps.save(otp);
            throw new BadRequestException('Invalid verification code');
        }

        otp.consumedAt = new Date();
        await this.otps.save(otp);

        return { resetToken: this.issueResetToken(user) };
    }

    async resetPassword(dto: ResetPasswordDto) {
        const resetSecret = this.config.get<string>('JWT_RESET_SECRET', 'dev-reset-secret');
        let payload: { sub: string; email?: string; typ?: string };

        try {
            payload = this.jwt.verify(dto.token, { secret: resetSecret });
        } catch {
            throw new UnauthorizedException('Invalid reset token');
        }

        if (payload.typ !== 'password_reset') {
            throw new UnauthorizedException('Invalid reset token');
        }

        const user = await this.users.findOne({ where: { id: payload.sub } });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        user.passwordHash = await bcrypt.hash(dto.password, 10);
        if (user.status !== UserStatus.ACTIVE) {
            user.status = UserStatus.ACTIVE;
        }

        await this.users.save(user);

        await this.refreshTokens.update(
            { userId: user.id, isRevoked: false },
            { isRevoked: true },
        );

        try {
            await this.mailer.sendPasswordResetConfirmation(user.email);
        } catch {
            // Avoid failing reset when email delivery fails.
        }

        return { message: 'Password reset successful' };
    }

    async signIn(dto: SignInDto) {
        const email = normalizeEmail(dto.email);
        const user = await this.users.findOne({ where: { email } });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        if (user.status !== UserStatus.ACTIVE) {
            throw new UnauthorizedException('Account not verified');
        }

        const matches = await bcrypt.compare(dto.password, user.passwordHash);
        if (!matches) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.issueTokens(user);
    }

    async signInWithGoogle(dto: GoogleSignInDto) {
        const clientId = this.config.get<string>('GOOGLE_CLIENT_ID');
        if (!clientId) {
            throw new BadRequestException('Google sign-in not configured');
        }

        const tokenInfo = await this.fetchGoogleTokenInfo(dto.idToken);
        if (!tokenInfo.email || tokenInfo.aud !== clientId) {
            throw new UnauthorizedException('Invalid Google token');
        }

        const emailVerified = tokenInfo.email_verified === true || tokenInfo.email_verified === 'true';
        if (!emailVerified) {
            throw new UnauthorizedException('Google email not verified');
        }

        const email = normalizeEmail(tokenInfo.email);
        let user = await this.users.findOne({ where: { email } });

        if (!user) {
            const randomPassword = randomBytes(32).toString('hex');
            const passwordHash = await bcrypt.hash(randomPassword, 10);

            user = this.users.create({
                email,
                passwordHash,
                role: UserRole.CONSUMER,
                status: UserStatus.ACTIVE,
                firstName: tokenInfo.given_name ?? undefined,
                lastName: tokenInfo.family_name ?? undefined,
                avatarUrl: tokenInfo.picture ?? undefined,
            });

            user = await this.users.save(user);
        } else {
            let shouldSave = false;

            if (user.status !== UserStatus.ACTIVE) {
                user.status = UserStatus.ACTIVE;
                shouldSave = true;
            }

            if (!user.firstName && tokenInfo.given_name) {
                user.firstName = tokenInfo.given_name;
                shouldSave = true;
            }

            if (!user.lastName && tokenInfo.family_name) {
                user.lastName = tokenInfo.family_name;
                shouldSave = true;
            }

            if (!user.avatarUrl && tokenInfo.picture) {
                user.avatarUrl = tokenInfo.picture;
                shouldSave = true;
            }

            if (shouldSave) {
                user = await this.users.save(user);
            }
        }

        return this.issueTokens(user);
    }

    async refresh(dto: RefreshTokenDto) {
        const refreshSecret = this.config.get<string>('JWT_REFRESH_SECRET', 'dev-refresh-secret');
        let payload: { sub: string };

        try {
            payload = this.jwt.verify(dto.refreshToken, { secret: refreshSecret });
        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const stored = await this.refreshTokens.findOne({
            where: { userId: payload.sub, isRevoked: false },
            order: { createdAt: 'DESC' },
        });

        if (!stored || stored.expiresAt <= new Date()) {
            throw new UnauthorizedException('Refresh token expired');
        }

        const matches = await bcrypt.compare(dto.refreshToken, stored.tokenHash);
        if (!matches) {
            throw new UnauthorizedException('Refresh token mismatch');
        }

        stored.isRevoked = true;
        await this.refreshTokens.save(stored);

        const user = await this.users.findOne({ where: { id: payload.sub } });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return this.issueTokens(user);
    }

    private async createOtp(email: string, purpose: OtpPurpose): Promise<string> {
        const ttlMinutes = Number(this.config.get('OTP_TTL_MINUTES', 5));
        const maxAttempts = Number(this.config.get('OTP_MAX_ATTEMPTS', 5));
        const code = randomInt(0, 10 ** OTP_CODE_LENGTH).toString().padStart(OTP_CODE_LENGTH, '0');
        const codeHash = await bcrypt.hash(code, 10);

        await this.otps.update(
            { email, purpose, consumedAt: IsNull() },
            { consumedAt: new Date() },
        );

        const otp = this.otps.create({
            email,
            purpose,
            codeHash,
            maxAttempts,
            expiresAt: new Date(Date.now() + ttlMinutes * 60 * 1000),
        });

        await this.otps.save(otp);
        return code;
    }

    private async assertResendAllowed(email: string, purpose: OtpPurpose) {
        const activeOtp = await this.otps.findOne({
            where: { email, purpose, consumedAt: IsNull() },
            order: { createdAt: 'DESC' },
        });

        if (activeOtp && activeOtp.expiresAt > new Date()) {
            throw new BadRequestException(
                'Verification code still valid. Please wait before requesting a new code.',
            );
        }
    }

    private async issueTokens(user: User) {
        const accessSecret = this.config.get<string>('JWT_ACCESS_SECRET', 'dev-access-secret');
        const refreshSecret = this.config.get<string>('JWT_REFRESH_SECRET', 'dev-refresh-secret');
        const accessTtl = this.config.get<string>('JWT_ACCESS_TTL', '15m');
        const refreshTtl = this.config.get<string>('JWT_REFRESH_TTL', '7d');
        const accessExpiresIn = Math.floor(parseDurationToMs(accessTtl) / 1000) || 900;
        const refreshExpiresIn = Math.floor(parseDurationToMs(refreshTtl) / 1000) || 604800;

        const accessToken = this.jwt.sign(
            { sub: user.id, email: user.email, role: user.role },
            { secret: accessSecret, expiresIn: accessExpiresIn },
        );

        const refreshToken = this.jwt.sign(
            { sub: user.id },
            { secret: refreshSecret, expiresIn: refreshExpiresIn },
        );

        await this.refreshTokens.update(
            { userId: user.id, isRevoked: false },
            { isRevoked: true },
        );

        const tokenHash = await bcrypt.hash(refreshToken, 10);
        const expiresAt = new Date(Date.now() + parseDurationToMs(refreshTtl));

        await this.refreshTokens.save(
            this.refreshTokens.create({ userId: user.id, tokenHash, expiresAt }),
        );

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                status: user.status,
                firstName: user.firstName,
                lastName: user.lastName,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        };
    }

    private issueResetToken(user: User) {
        const resetSecret = this.config.get<string>('JWT_RESET_SECRET', 'dev-reset-secret');
        const resetTtl = this.config.get<string>('JWT_RESET_TTL', '15m');
        const resetExpiresIn = Math.floor(parseDurationToMs(resetTtl) / 1000) || 900;

        return this.jwt.sign(
            { sub: user.id, email: user.email, typ: 'password_reset' },
            { secret: resetSecret, expiresIn: resetExpiresIn },
        );
    }

    private async fetchGoogleTokenInfo(idToken: string): Promise<GoogleTokenInfo> {
        const response = await fetch(
            `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`,
        );

        if (!response.ok) {
            throw new UnauthorizedException('Invalid Google token');
        }

        return (await response.json()) as GoogleTokenInfo;
    }
}