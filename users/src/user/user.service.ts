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

    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.isActive = true')
      .take(limit)
      .skip(offset)
      .leftJoinAndSelect('user.country', 'country')
      .getMany();

    if (!users.length) {
      throw new NotFoundException(`Users not found`);
    }
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

  async findOneWithRolesAndPermissions(term: string): Promise<User | User[]> {
    let user: User | Promise<User | User[]>;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.country', 'country')
      .innerJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('role.permission', 'permission');

    if (isUUID(term)) {
      user = await queryBuilder.where('user.id = :id', { id: term }).getOne();
    } else if (isNaN(+term)) {
      if (isEmail(term)) {
        user = await queryBuilder
          .where('user.email = :email', { email: term })
          .getOne();
      } else {
        user = await queryBuilder
          .where('user.fullName = :fullName', { fullName: term })
          .getOne();
      }
    }

    if (!user) {
      throw new NotFoundException(`User with search term: "${term}" not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { originCountry, ...updateData } = updateUserDto;

    if (originCountry) {
      const country = await this.countryRepository.findOneBy({
        name: originCountry,
      });
      const user = await this.userRepository.preload({
        id,
        country,
      });
      await this.userRepository.save(user);
    }

    const user = await this.userRepository.preload({
      id,
      ...updateData,
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
