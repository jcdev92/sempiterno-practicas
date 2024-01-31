import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { Country } from './entities/country.entity';
import { Repository } from 'typeorm';
import { isNumber } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CountryService {
  private readonly logger = new Logger('CountryService');

  constructor(
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
  ) {}

  async create(createCountryDto: CreateCountryDto) {
    try {
      const country = this.countryRepository.create(createCountryDto);
      await this.countryRepository.save(country);
      return country;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll() {
    return await this.countryRepository.find();
  }

  async findOne(term: string) {
    let country: Country;

    if (isNumber(+term)) {
      country = await this.countryRepository.findOneBy({ id: +term });
    } else if (isNaN(+term)) {
      country = await this.countryRepository.findOneBy({ name: term });
    }

    if (!country) {
      throw new NotFoundException(
        `Country with search term: "${term}" not found`,
      );
    }

    return country;
  }

  async update(id: number, updateCountryDto: UpdateCountryDto) {
    const country = await this.countryRepository.preload({
      id,
      ...updateCountryDto,
    });
    if (!country) {
      throw new NotFoundException(`Country with id: ${id} not found`);
    }
    try {
      await this.countryRepository.save(country);
      return country;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: number) {
    const country = await this.countryRepository.findOneBy({ id });
    if (!country) {
      throw new NotFoundException(`Country with id: ${id} not found`);
    }
    await this.countryRepository.delete(id);
    return {
      message: `Country with id: ${id} deleted successfully`,
    };
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error!, check server logs',
    );
  }
}
