import { Injectable } from '@nestjs/common';
import { CountryService } from 'src/country/country.service';
import { initialData } from './data/countries-seed';

@Injectable()
export class SeedService {
  constructor(private readonly countryService: CountryService) {}

  async runSeed() {
    await this.insertNewCountry();
    return 'SEED EXECUTED';
  }

  private async insertNewCountry() {
    await this.countryService.removeAll();
    const countries = initialData;
    const insertPromises = [];
    countries.map((country) => {
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
