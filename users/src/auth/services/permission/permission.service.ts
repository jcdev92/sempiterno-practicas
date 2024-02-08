import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/auth/entities';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PermissionService implements OnModuleInit {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.createStaticPermissions();
  }

  private async createStaticPermissions() {
    const permissions = this.configService
      .get('DEFAULT_PERMISSIONS')
      .split(' ');

    for (const permissionName of permissions) {
      const permission = await this.permissionRepository.findOne({
        where: { title: permissionName },
      });

      if (!permission) {
        await this.permissionRepository.save({ title: permissionName });
      }
    }
  }

  async getPermissions() {
    return await this.permissionRepository.find();
  }
}
