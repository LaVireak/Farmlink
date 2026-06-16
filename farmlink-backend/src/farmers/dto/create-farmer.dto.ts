import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class UploadedImageDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsString()
  dataUrl: string;
}

export class CreateFarmerOnboardingDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  commune?: string;

  @IsOptional()
  @IsString()
  farmName?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => UploadedImageDto)
  idPhoto?: UploadedImageDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UploadedImageDto)
  farmDeed?: UploadedImageDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UploadedImageDto)
  profilePhoto?: UploadedImageDto;
}
