// import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCountryDto } from './create-country.dto';

export class UpdateCountryDto extends PartialType(CreateCountryDto) {
  @ApiProperty({
    description: 'Country name',
    example: 'Brazil',
    required: true,
    type: String,
    uniqueItems: true,
    minLength: 2,
  })
  name?: string;

  @ApiProperty({
    description: 'Country code',
    example: 'BR',
    required: false,
    type: String,
    minLength: 2,
  })
  code?: string;
}
