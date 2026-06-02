import { IsOptional, IsString, IsNumber, Length } from 'class-validator';

export class UpdateFarmerProfileDto {
  @IsOptional()
  @IsString()
  farmName?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  addressDetail?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  province?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  district?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsString()
  productTags?: string;

  // Base64 data URL — saved to disk, stored as coverImageUrl
  @IsOptional()
  @IsString()
  coverImageDataUrl?: string;
}
