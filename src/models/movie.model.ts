import { col, fn } from 'sequelize';
import {
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  AllowNull,
  Table,
} from 'sequelize-typescript';
import Character from './character.model';
import Genre from './genre.model';
import MovieCharacter from './movie-character.model';

/**
 * Represents a movie or series.
 */
@Table({
  tableName: 'movies',
  updatedAt: false,
  indexes: [
    {
      name: 'title_idx',
      fields: [fn('to_tsvector', 'english', col('title'))],
      using: 'gin',
    },
  ],
})
export default class Movie extends Model {
  /**
   * Title of the movie.
   *
   * @example 'The Lion King'
   */
  @AllowNull(false)
  @Column(DataType.STRING(100))
  title!: string;

  /**
   * URL of the movie's poster.
   *
   * @example 'https://upload.wikimedia.org/wikipedia/en/3/3d/The_Lion_King_poster.jpg'
   */
  @Column(DataType.STRING(2048))
  imageUrl!: string | null;

  /**
   * Id of the movie's genre.
   *
   * @example 1
   */
  @ForeignKey(() => Genre)
  @AllowNull(false)
  @Column
  genreId!: number;

  /**
   * Genre of the movie.
   */
  @BelongsTo(() => Genre)
  genre!: Genre;

  /**
   * Numeric rating of the movie.
   *
   * Varies from 1 to 5 (both inclusive).
   * Maximum 1 decimal place.
   *
   * @example 4.7
   */
  @Column(DataType.DECIMAL(2, 1))
  rating!: number | null;

  /**
   * Date when the movie was added to the database.
   *
   * @example '2022-04-23T02:17:57.207Z'
   */
  @CreatedAt
  createdAt!: Date;

  /**
   * List of characters of the movie.
   */
  @BelongsToMany(() => Character, () => MovieCharacter)
  characters!: Character[];
}
