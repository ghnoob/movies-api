import { col, fn } from 'sequelize';
import {
  Column,
  DataType,
  HasMany,
  Model,
  AllowNull,
  Table,
} from 'sequelize-typescript';
import Movie from './movie.model';

/**
 * Reprensents the genre of a movie or series.
 */
@Table({
  tableName: 'genres',
  timestamps: false,
  indexes: [
    {
      unique: true,
      name: 'unique_name',
      fields: [fn('lower', col('name'))],
    },
  ],
})
export default class Genre extends Model {
  /**
   * Name of the genre.
   *
   * @example 'Drama'
   */
  @AllowNull(false)
  @Column(DataType.STRING(30))
  name!: string;

  /**
   * Url for the image of the genre.
   *
   * @example 'https://upload.wikimedia.org/wikipedia/commons/1/10/Drama_Masks.svg'
   */
  @Column(DataType.STRING(2048))
  imageUrl!: string | null;

  /**
   * List of movies that belong to the genre.
   */
  @HasMany(() => Movie)
  movies!: Movie[];
}
