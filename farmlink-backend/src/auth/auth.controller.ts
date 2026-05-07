import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestSignupOtpDto } from './dto/request-signup-otp.dto';
import { ResendSignupOtpDto } from './dto/resend-signup-otp.dto';
import { SignInDto } from './dto/signin.dto';
import { VerifySignupOtpDto } from './dto/verify-signup-otp.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly auth: AuthService) {}

	@Post('signup/request-otp')
	requestSignupOtp(@Body() dto: RequestSignupOtpDto) {
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

	@Post('refresh')
    @HttpCode(HttpStatus.OK)
	refresh(@Body() dto: RefreshTokenDto) {
		return this.auth.refresh(dto);
	}
}
