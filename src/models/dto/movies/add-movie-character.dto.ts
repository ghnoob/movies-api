import { Expose } from 'class-transformer';
import { IsInt } from 'class-validator';

export default class AddMovieCharacterDto {
  @Expose()
  @IsInt()
  characterId!: number;
}
