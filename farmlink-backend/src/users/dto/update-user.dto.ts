import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  firstName?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  lastName?: string;

  @IsOptional()
  @IsString()
  @Length(1, 30)
  phoneNumber?: string;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  avatarDataUrl?: string;

  @IsOptional()
  @IsBoolean()
  removeAvatar?: boolean;

  @IsOptional()
  @IsString()
  @Length(2, 5)
  languagePref?: string;

  @IsOptional()
  @IsString()
  @Length(5, 500)
  address?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  province?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  district?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  commune?: string;
}
