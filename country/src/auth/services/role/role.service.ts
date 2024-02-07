import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission, Role, User } from 'src/auth/entities'; // Ajusta la ruta según la ubicación real
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { CreateRoleDto } from '../../dto/role-dto/create-role.dto';
import { UpdateRoleDto } from 'src/auth/dto';

@Injectable()
export class RoleService implements OnModuleInit {
  private roles: Role[];
  private permissions: Permission[];

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.createStaticRoles();
    await this.createStaticUserAdmin();
  }

  //? crear roles estaticos si no existen en la base de datos al iniciar la aplicacion.
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

    //? Optimizacion de consultas a las base de datos
    // Obtener todos los roles de la base de datos y almacenarlos en la propiedad "roles" del servicio.
    this.roles = await this.roleRepository.find();

    // extraer los roles "admin" y "user" qeu seran por defecto los estaticos, desde la propiedad "roles" para luego asignarles sus respectivos permisos.
    const [adminRole, userRole] = this.roles;

    // Obtener todos los permisos de la base de datos y almacenarlos en la propiedad "permissions" del servicio.
    this.permissions = await this.permissionRepository.find();

    // Asignar todos los permisos al rol "admin"
    if (adminRole && this.permissions) {
      adminRole.permission = this.permissions;
      await this.roleRepository.save(adminRole);
    }

    // Obtener el permiso "read" de la propiedad permissions en lugar de hacer consulta a la base de datos
    const readPermission = this.permissions.find(
      (permission) => permission.title === 'read',
    );

    // Asignar el permiso "read" al rol "user"
    if (userRole && readPermission) {
      userRole.permission = [readPermission];
      await this.roleRepository.save(userRole);
    }
  }

  //? Crear un usuario administrador al iniciar si no existe
  private async createStaticUserAdmin() {
    const [adminRole] = this.roles;
    if (!adminRole) {
      console.error("El rol 'admin' no existe.");
      return;
    }

    const adminUser = await this.userRepository.findOne({
      where: { email: this.configService.get('EMAIL_ADMIN') },
    });

    const password = this.configService.get('PASS_ADMIN');

    if (!adminUser) {
      const user = this.userRepository.create({
        email: this.configService.get('EMAIL_ADMIN'),
        password: bcrypt.hashSync(password, 10),
        fullName: this.configService.get('USER_ADMIN'),
        role: [adminRole],
      });
      await this.userRepository.save(user);
    }
  }

  async createRole(createRoleDto: CreateRoleDto) {
    try {
      const { permissions: permissionTitles, ...roleData } = createRoleDto;

      // Obtener los IDs de los permisos usando los titulos recibidos
      const permissionEntities = await Promise.all(
        permissionTitles.map((title) =>
          this.permissionRepository.findOne({ where: { title } }),
        ),
      );

      // Crear el objeto de rol
      const role = this.roleRepository.create({
        ...roleData,
        permission: permissionEntities.filter(Boolean), // Filtrar permisos encontrados
      });

      // Guardar el rol en la base de datos
      await this.roleRepository.save(role);

      return role;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async getRoles() {
    const queryBuilder = this.roleRepository.createQueryBuilder('role');
    const roles = await queryBuilder
      .leftJoinAndSelect('role.permission', 'permission')
      .getMany();
    return roles;
  }

  async findRole(term: string) {
    let role: Role;
    if (Number(term)) {
      role = await this.roleRepository.findOneBy({ id: +term });
    } else {
      role = await this.roleRepository.findOneBy({ title: term });
    }
    if (!role) {
      throw new NotFoundException(`Role with term: ${term} not found`);
    }
    return role;
  }

  async updateRole(updateRoleDto: UpdateRoleDto, term: string) {
    // Buscar el rol a actualizar
    const role = await this.findRole(term);

    if (role) {
      try {
        const { permissions: permissionTitles, ...roleData } = updateRoleDto;

        // Obtener los IDs de los permisos usando los títulos recibidos
        const permissionEntities = await Promise.all(
          permissionTitles.map((title) =>
            this.permissionRepository.findOne({ where: { title } }),
          ),
        );

        // Actualizar los datos del rol
        role.title = roleData.title; // Actualizar el título del rol si es necesario
        // Asignar los nuevos permisos al rol
        role.permission = permissionEntities.filter(Boolean);

        // Guardar los cambios en el rol
        await this.roleRepository.save(role);

        return role;
      } catch (error) {
        // Manejar errores
        this.handleDBErrors(error);
      }
    } else {
      return { message: `Role with term: ${term} not found` };
    }
  }

  async deleteRole(id: number) {
    const role = await this.findRole(id.toString());
    try {
      await this.roleRepository.delete(role.id);
      return { message: 'Role deleted', role: role };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    throw new InternalServerErrorException('Please check server logs');
  }
}
