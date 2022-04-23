import { BelongsTo, Column, CreatedAt, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import Genre from './genre.model';

/**
 * Represents a movie or series.
 */
@Table({ tableName: 'movie', updatedAt: false })
export default class Movie extends Model {
  /**
   * Title of the movie.
   *
   * @example 'The Lion King'
   */
  @Column(DataType.STRING(100))
  title!: string;

  /**
   * URL of the movie's poster.
   *
   * @example 'https://upload.wikimedia.org/wikipedia/en/3/3d/The_Lion_King_poster.jpg'
   */
  @Column(DataType.STRING(2048))
  imageUrl!: string;

  /**
   * Id of the movie's genre.
   *
   * @example 1
   */
  @ForeignKey(() => Genre)
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
  rating!: number;

  /**
   * Date when the movie was added to the database.
   *
   * @example '2022-04-23T02:17:57.207Z'
   */
  @CreatedAt
  createdAt!: Date;
}
