import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length, MinLength } from 'class-validator';
import { UserRole } from '../../common/enums/role.enum';

export class RequestSignupOtpDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @IsOptional()
    @IsString()
    @Length(1, 100)
    firstName?: string;

    @IsOptional()
    @IsString()
    @Length(1, 100)
    lastName?: string;
}

