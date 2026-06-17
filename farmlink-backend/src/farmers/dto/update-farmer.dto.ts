import {
  ArrayMaxSize,
  IsArray,
  MaxLength,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

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
  @MaxLength(100)
  province?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
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

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(12)
  @IsString({ each: true })
  farmPhotoDataUrls?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(12)
  @IsString({ each: true })
  farmPhotoUrls?: string[];
}
