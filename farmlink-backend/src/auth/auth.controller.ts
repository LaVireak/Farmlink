import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { ResendSignupOtpDto } from './dto/resend-signup-otp.dto';
import { SignInDto } from './dto/signin.dto';
import { VerifySignupOtpDto } from './dto/verify-signup-otp.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { GoogleSignInDto } from './dto/google-signin.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResendResetOtpDto } from './dto/resend-reset-otp.dto';
import { VerifyResetOtpDto } from './dto/verify-reset-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Public } from './decorators/public.decorator';

@Public()
@Controller('auth')
export class AuthController {
	constructor(private readonly auth: AuthService) {}

	@Post('signup/request-otp')
	requestSignupOtp(@Body() dto: SignupDto) {
		return this.auth.requestSignupOtp(dto);
	}

	@Post('signup/resend-otp')
	resendSignupOtp(@Body() dto: ResendSignupOtpDto) {
		return this.auth.resendSignupOtp(dto);
	}

	@Post('signup/verify-otp')
    @HttpCode(HttpStatus.OK)
	verifySignupOtp(@Body() dto: VerifySignupOtpDto) {
		return this.auth.verifySignupOtp(dto);
	}

	@Post('signin')
    @HttpCode(HttpStatus.OK)
	signIn(@Body() dto: SignInDto) {
		return this.auth.signIn(dto);
	}

	@Post('google')
    @HttpCode(HttpStatus.OK)
	googleSignIn(@Body() dto: GoogleSignInDto) {
		return this.auth.signInWithGoogle(dto);
	}

	@Post('password/request-otp')
	requestPasswordResetOtp(@Body() dto: ForgotPasswordDto) {
		return this.auth.requestPasswordResetOtp(dto);
	}

	@Post('password/resend-otp')
	resendPasswordResetOtp(@Body() dto: ResendResetOtpDto) {
		return this.auth.resendPasswordResetOtp(dto);
	}

	@Post('password/verify-otp')
    @HttpCode(HttpStatus.OK)
	verifyPasswordResetOtp(@Body() dto: VerifyResetOtpDto) {
		return this.auth.verifyPasswordResetOtp(dto);
	}

	@Post('password/reset')
    @HttpCode(HttpStatus.OK)
	resetPassword(@Body() dto: ResetPasswordDto) {
		return this.auth.resetPassword(dto);
	}

	@Post('refresh')
    @HttpCode(HttpStatus.OK)
	refresh(@Body() dto: RefreshTokenDto) {
		return this.auth.refresh(dto);
	}
}
