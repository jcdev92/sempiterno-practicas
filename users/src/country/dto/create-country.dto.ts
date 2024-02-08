import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCountryDto {
  @IsString()
  @MinLength(2)
  @ApiProperty({
    description: 'Country name',
    example: 'Brazil',
    required: true,
    type: String,
    uniqueItems: true,
    minLength: 2,
  })
  name: string;

  @IsOptional({
    always: true,
  })
  @ApiProperty({
    description: 'Country code',
    example: 'BR',
    required: false,
    type: String,
    minLength: 2,
  })
  code?: string;
}
