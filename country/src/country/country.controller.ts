import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CountryService } from './country.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidPermissions } from 'src/auth/interfaces';
import { User } from 'src/auth/entities';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Country')
@ApiBearerAuth()
@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Post()
  @ApiOperation({
    summary: 'An user with administrator permission can create a country',
    description: 'An user with administrator permission can create a country',
  })
  @ApiResponse({ status: 201, description: 'Country was created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized, token not valid' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Auth(ValidPermissions.administrator)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(@Body() createCountryDto: CreateCountryDto, @GetUser() user: User) {
    return this.countryService.create(createCountryDto);
  }

  @Get()
  @ApiOperation({
    summary: 'An user with administrator permission can get all countries',
    description: 'An user with administrator permission can get all countries',
  })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 401, description: 'Unauthorized, token not valid' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'offset',
    type: Number,
    required: false,
  })
  @Auth(ValidPermissions.administrator)
  findAll(
    @Query() paginationDto: PaginationDto, // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @GetUser() user: User,
  ) {
    return this.countryService.findAll(paginationDto);
  }

  @Get(':term')
  @ApiOperation({
    summary: 'An user with administrator permission can get a specific country',
    description:
      'An user with administrator permission can get a specific country',
  })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 401, description: 'Unauthorized, token not valid' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  @ApiResponse({ status: 404, description: 'Country not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Auth(ValidPermissions.administrator)
  findOne(
    @Param('term') term: string, // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @GetUser() user: User,
  ) {
    return this.countryService.findOne(term);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'An user with administrator permission can update a country',
    description: 'An user with administrator permission can update a country',
  })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 401, description: 'Unauthorized, token not valid' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  @ApiResponse({ status: 404, description: 'Country not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Auth(ValidPermissions.administrator)
  update(
    @Param('id') id: string,
    @Body() updateCountryDto: UpdateCountryDto,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @GetUser() user: User,
  ) {
    return this.countryService.update(+id, updateCountryDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'An user with administrator permission can delete a country',
    description: 'An user with administrator permission can delete a country',
  })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 401, description: 'Unauthorized, token not valid' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  @ApiResponse({ status: 404, description: 'Country not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Auth(ValidPermissions.administrator)
  remove(
    @Param('id') id: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @GetUser() user: User,
  ) {
    return this.countryService.remove(+id);
  }
}
