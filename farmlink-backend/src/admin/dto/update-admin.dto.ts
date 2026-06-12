import { IsString, IsEmail, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { UserRole } from '../../common/enums/role.enum';
import { UserStatus } from '../../common/enums/user-status.enum';

export class UpdateAdminDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}

export class SuspendUserDto {
  @IsString()
  reason: string;
}

export class UpdateUserRoleDto {
  @IsEnum(UserRole)
  role: UserRole;
}

export class UpdateOrderStatusDto {
  @IsString()
  status: string;
}

export class ApproveProductDto {
  @IsOptional()
  @IsString()
  notes?: string;
}

export class RejectProductDto {
  @IsString()
  reason: string;
}

export class MatchFarmerDto {
  @IsUUID()
  buyerId: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateFarmerAdminDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  farmName?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  addressDetail?: string;

  @IsOptional()
  totalSales?: number;

  @IsOptional()
  @IsString()
  productTags?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  avatarDataUrl?: string;

  @IsOptional()
  @IsString()
  idDocumentDataUrl?: string;
}
