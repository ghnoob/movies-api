import { Column, DataType, Model, Table } from 'sequelize-typescript';

/**
 * Represents a character who appears in a movie or series.
 */
@Table({ tableName: 'characters', timestamps: false })
export default class Character extends Model {
  /**
   * Character's name.
   *
   * @example 'Simba'
   */
  @Column(DataType.STRING(30))
  name!: string;

  /**
   * Url of the character's picture.
   *
   * @example 'https://upload.wikimedia.org/wikipedia/en/9/94/Simba_%28_Disney_character_-_adult%29.png'
   */
  @Column(DataType.STRING(2048))
  imageUrl!: string;

  /**
   * Character's age, in years.
   */
  @Column(DataType.INTEGER)
  age!: number;

  /**
   * Character's weight, in kilograms.
   */
  @Column(DataType.INTEGER)
  weight!: number;

  /**
   * Character's backstory and/or a summary of the character's involvement in the
   * productions they took part of.
   */
  @Column(DataType.STRING(1000))
  history!: string;
}
