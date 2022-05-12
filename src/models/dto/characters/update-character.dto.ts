import { Expose } from 'class-transformer';
import { IsInt, IsString, IsOptional, IsUrl, MaxLength } from 'class-validator';
import Trim from '../../../decorators/trim.decorator';

export default class UpdateCharacterDto {
  @Expose()
  @MaxLength(30)
  @Trim()
  @IsString()
  @IsOptional()
  name?: string;

  @Expose()
  @IsUrl()
  @MaxLength(2048)
  @Trim()
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
  @Trim()
  @IsString()
  @IsOptional()
  history?: string;
}
