import { Reflector } from '@nestjs/core';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../entities';
import { META_PERMISSION } from '../decorators/permission-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validPermission: string[] = this.reflector.get(
      META_PERMISSION,
      context.getHandler(),
    );
    if (!validPermission) return true;
    if (validPermission.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    // conver object user.role in a string with the titles
    const roles = [];
    roles.push(user.role.map((role) => role.title));

    const rolePermissions = user.role.map((role) =>
      role.permission.map((permission) => permission.title),
    );

    const hasPermission = () =>
      validPermission.every((permission) =>
        rolePermissions.flat().includes(permission),
      );

    if (hasPermission()) return true;

    if (!user) throw new BadRequestException('User not found');

    throw new ForbiddenException(
      `User ${user.fullName} with roles: " ${roles} " need a valid permission: [${validPermission}]`,
    );
  }
}
