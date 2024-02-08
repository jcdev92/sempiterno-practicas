import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { AuthModule } from 'src/auth/auth.module';
import { CountryModule } from 'src/country/country.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [CountryModule, AuthModule],
})
export class SeedModule {}
