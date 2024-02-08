import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../entities/user.entity';
import { JwtPayLoad } from '../interfaces/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(payload: JwtPayLoad): Promise<User> {
    const { id } = payload;
    const user = await this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('role.permission', 'permission')
      .where('user.id = :id', { id })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('User is inactive');
    }
    return user;
  }
}
