import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission, Role } from 'src/auth/entities'; // Ajusta la ruta según la ubicación real
import { Repository } from 'typeorm';

@Injectable()
export class RoleService implements OnModuleInit {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async onModuleInit() {
    await this.createStaticRoles();
  }

  private async createStaticRoles() {
    // Crear roles "admin" y "user" si no existen
    const roles = ['admin', 'user'];
    for (const roleName of roles) {
      const role = await this.roleRepository.findOne({
        where: { title: roleName },
      });

      if (!role) {
        await this.roleRepository.save({ title: roleName });
      }
    }

    // Obtener roles "admin" y "user" después de su creación
    const adminRole = await this.roleRepository.findOne({
      where: { title: 'admin' },
    });
    const userRole = await this.roleRepository.findOne({
      where: { title: 'user' },
    });

    // Obtener todos los permisos de la base de datos
    const allPermissions = await this.permissionRepository.find();

    // Asignar todos los permisos al rol "admin"
    if (adminRole && allPermissions) {
      adminRole.permission = allPermissions;
      await this.roleRepository.save(adminRole);
    }

    // Obtener el permiso "read" de la base de datos
    const readPermission = await this.permissionRepository.findOne({
      where: { title: 'read' },
    });

    // Asignar el permiso "read" al rol "user"
    if (userRole && readPermission) {
      userRole.permission = [readPermission];
      await this.roleRepository.save(userRole);
    }
  }
}
