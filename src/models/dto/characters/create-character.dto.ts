import { Expose } from 'class-transformer';
import { IsInt, IsString, IsOptional, IsUrl, MaxLength } from 'class-validator';

export default class CreateCharacterDto {
  @Expose()
  @MaxLength(30)
  @IsString()
  name!: string;

  @Expose()
  @IsUrl()
  @MaxLength(2048)
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @Expose()
  @IsInt()
  @IsOptional()
  age?: number;

  @Expose()
  @IsInt()
  @IsOptional()
  weight?: number;

  @Expose()
  @MaxLength(1000)
  @IsString()
  @IsOptional()
  history?: string;
}
