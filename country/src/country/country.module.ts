import { Module, forwardRef } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [CountryController],
  providers: [CountryService],
  imports: [TypeOrmModule.forFeature([Country]), forwardRef(() => AuthModule)],
  exports: [TypeOrmModule, CountryService],
})
export class CountryModule {}
