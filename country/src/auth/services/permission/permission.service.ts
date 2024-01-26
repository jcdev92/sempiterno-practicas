import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/auth/entities';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionService implements OnModuleInit {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async onModuleInit() {
    await this.createStaticPermissions();
  }

  private async createStaticPermissions() {
    const permissions = ['read', 'write', 'delete'];
    for (const permissionName of permissions) {
      const permission = await this.permissionRepository.findOne({
        where: { title: permissionName },
      });

      if (!permission) {
        await this.permissionRepository.save({ title: permissionName });
      }
    }
  }
}
