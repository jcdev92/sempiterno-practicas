import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, LoginUserDto } from './dto';
import { Role, User } from './entities';
import { JwtPayLoad } from './interfaces';
import { Country } from 'src/country/entities/country.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, originCountry, ...userData } = createUserDto;

      let user: User;
      if (originCountry) {
        const country = await this.countryRepository.findOneBy({
          name: originCountry,
        });

        if (!country) throw new NotFoundException('Country not found');

        user = this.userRepository.create({
          ...userData,
          password: bcrypt.hashSync(password, 10),
          country: country,
        });
      } else {
        user = this.userRepository.create({
          ...userData,
          password: bcrypt.hashSync(password, 10),
        });
      }

      const userRole = await this.roleRepository.findOneBy({ title: 'user' });
      user.role = [userRole];

      await this.userRepository.save(user);
      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.handleDBErros(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true },
    });
    if (!user)
      throw new BadRequestException('Credentials are not valid (email)');

    if (!bcrypt.compareSync(password, user.password))
      throw new BadRequestException('Credentials are not valid (password)');

    delete user.password;

    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  private getJwtToken(payload: JwtPayLoad) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBErros(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    throw new InternalServerErrorException('Please check server logs');
  }
}
