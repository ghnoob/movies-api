import { hash } from 'bcrypt';
import { col, fn } from 'sequelize';
import {
  BeforeCreate,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

@Table({
  tableName: 'users',
  timestamps: false,
  indexes: [
    {
      name: 'email_idx',
      unique: true,
      fields: [fn('lower', col('email'))],
    },
  ],
})
export default class User extends Model {
  @Column({
    type: DataType.STRING(320),
    allowNull: false,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @BeforeCreate
  static async hashPassword(instance: User) {
    instance.password = await hash(instance.password, 10);
  }
}
