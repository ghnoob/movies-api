import { Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
import NormalizeEmail from '../../../decorators/normalize-email.decorator';
import Trim from '../../../decorators/trim.decorator';

export default class LoginDto {
  @Expose()
  @NormalizeEmail()
  @IsEmail()
  @Trim()
  email!: string;

  @Expose()
  @IsString()
  password!: string;
}
