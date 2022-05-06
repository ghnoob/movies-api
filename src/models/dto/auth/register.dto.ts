import { Expose } from 'class-transformer';
import { Matches, MinLength } from 'class-validator';
import IsEqualToProperty from '../../../decorators/is-equal-to-property.decorator';

import LoginDto from './login.dto';

export default class RegisterDto extends LoginDto {
  @Matches(/[A-Z]/, {
    message: '$property must include at least one uppercase letter.',
  })
  @Matches(/[a-z]/, {
    message: '$property must include at least one lowercase letter.',
  })
  @Matches(/\d/, { message: '$property must include at least one number.' })
  @Matches(/[ -/:-@[-`{-~]/, {
    message: '$property must include at least one special character.',
  })
  @MinLength(8)
  password!: string;

  @Expose()
  @IsEqualToProperty('password', { message: 'passwords do not match.' })
  passwordConfirmation!: string;
}
