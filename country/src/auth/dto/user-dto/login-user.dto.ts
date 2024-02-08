import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsEmail()
  @ApiProperty({
    description: 'User email',
    example: 'user@country.com',
    type: String,
    format: 'email',
  })
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  @ApiProperty({
    description: 'User password',
    type: String,
    format: 'password',
    example: 'myPassword123',
    minLength: 6,
    maxLength: 50,
  })
  password: string;
}
