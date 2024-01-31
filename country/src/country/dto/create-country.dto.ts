import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCountryDto {
  @IsString()
  name: string;

  @IsString()
  @MaxLength(3)
  @MinLength(1)
  code: string;
}
