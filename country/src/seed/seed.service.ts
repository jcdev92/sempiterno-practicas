import { Injectable } from '@nestjs/common';
import { CountryService } from 'src/country/country.service';
import { initialData } from './data/countries-seed';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class SeedService {
  constructor(
    private readonly countryService: CountryService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {
    await this.deleteTables();
    await this.insertNewCountry();
    return 'SEED EXECUTED';
  }

  private async deleteTables() {
    await this.countryService.removeAll();
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async insertNewCountry() {
    await this.countryService.removeAll();
    const countries = initialData;
    const insertPromises = [];
    countries.forEach((country) => {
      insertPromises.push(
        this.countryService.create({
          name: country,
        }),
      );
    });
    await Promise.all(insertPromises);
    return true;
  }
}
