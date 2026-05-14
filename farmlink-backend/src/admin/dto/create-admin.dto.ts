import { IsString, IsEmail, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { UserRole } from '../../common/enums/role.enum';

export class CreateAdminDto {
    @IsEmail()
    email: string;

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsString()
    phoneNumber: string;

    @IsString()
    password: string;

    @IsEnum(UserRole)
    role: UserRole;

    @IsOptional()
    @IsString()
    address?: string;
}
