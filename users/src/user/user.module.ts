import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/entities';
import { AuthModule } from 'src/auth/auth.module';
import { CountryModule } from 'src/country/country.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [TypeOrmModule.forFeature([User]), AuthModule, CountryModule],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
