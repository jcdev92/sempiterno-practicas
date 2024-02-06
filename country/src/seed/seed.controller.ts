import { Controller, Post } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidPermissions } from 'src/auth/interfaces';
import { User } from 'src/auth/entities';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @Auth(ValidPermissions.write)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createSeeds(@GetUser() user: User) {
    return this.seedService.runSeed();
  }
}
