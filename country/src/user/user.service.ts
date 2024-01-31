import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { UpdateUserDto } from '../auth/dto';
import { User } from 'src/auth/entities';
import { isEmail, isUUID } from 'class-validator';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  private readonly logger = new Logger('UserService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();
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
      throw new BadRequestException(
        `User with term search: "${term}" not found`,
      );
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
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
      throw new BadRequestException(
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
