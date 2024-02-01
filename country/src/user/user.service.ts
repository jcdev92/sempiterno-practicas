import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from '../auth/dto';
import { User } from 'src/auth/entities';
import { isEmail, isUUID } from 'class-validator';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from 'src/country/entities/country.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger('UserService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  async findAll(paginationDto: PaginationDto): Promise<User[]> {
    const { limit = 10, offset = 0 } = paginationDto;
    const users = await this.userRepository.find({
      take: limit,
      skip: offset,
      where: { isActive: true },
      relations: ['country'],
    });
    return users;
  }

  async findOne(term: string): Promise<User | User[]> {
    let user: User | Promise<User | User[]>;

    if (isUUID(term)) {
      user = await this.userRepository.findOneBy({ id: term });
    } else if (isNaN(+term)) {
      if (isEmail(term)) {
        user = await this.userRepository.findOneBy({ email: term });
      } else {
        user = await this.userRepository.findOneBy({ fullName: term });
      }
    }

    if (!user) {
      throw new NotFoundException(`User with search term: "${term}" not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { originCountry, ...updateData } = updateUserDto;
    const country = await this.countryRepository.findOneBy({
      name: originCountry,
    });
    if (!country) {
      throw new NotFoundException(
        `Country with name: "${originCountry}" not found`,
      );
    }
    const user = await this.userRepository.preload({
      id,
      ...updateData,
      country: country,
    });
    try {
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(
        `User with id: ${id} not found, can't delete`,
      );
    }
    user.isActive = false;
    await this.userRepository.save(user);
    this.logger.log(`User with id: ${id} deleted successfully`);
    return {
      message: `User with id: ${id} deleted successfully`,
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
