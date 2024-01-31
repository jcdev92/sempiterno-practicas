import { IsString } from 'class-validator';

export class CreateCountryDto {
  @IsString()
  name: string;
}
