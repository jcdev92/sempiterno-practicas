import { UseGuards, applyDecorators } from '@nestjs/common';
import { ValidPermissions } from '../interfaces';
import { PermissionProtected } from './permission-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role.guard';

export function Auth(...roles: ValidPermissions[]) {
  return applyDecorators(
    PermissionProtected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
}
