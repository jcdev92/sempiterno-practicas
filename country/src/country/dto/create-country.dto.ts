import { IsOptional, IsString } from 'class-validator';

export class CreateCountryDto {
  @IsString()
  name: string;

  @IsOptional()
  code?: string;
}
