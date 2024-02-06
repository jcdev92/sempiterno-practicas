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

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Post()
  @Auth(ValidPermissions.administrator)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(@Body() createCountryDto: CreateCountryDto, @GetUser() user: User) {
    return this.countryService.create(createCountryDto);
  }

  @Get()
  @Auth(ValidPermissions.administrator)
  findAll(
    @Query() paginationDto: PaginationDto, // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @GetUser() user: User,
  ) {
    return this.countryService.findAll(paginationDto);
  }

  @Get(':term')
  @Auth(ValidPermissions.administrator)
  findOne(
    @Param('term') term: string, // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @GetUser() user: User,
  ) {
    return this.countryService.findOne(term);
  }

  @Patch(':id')
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
  @Auth(ValidPermissions.administrator)
  remove(
    @Param('id') id: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @GetUser() user: User,
  ) {
    return this.countryService.remove(+id);
  }

  @Delete()
  @Auth(ValidPermissions.administrator)
  removeAll(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @GetUser() user: User,
  ) {
    return this.countryService.removeAll();
  }
}
