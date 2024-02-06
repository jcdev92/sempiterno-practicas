import { SetMetadata } from '@nestjs/common';
import { ValidPermissions } from 'src/auth/interfaces';

export const META_PERMISSION = 'permissions';

export const PermissionProtected = (...args: ValidPermissions[]) =>
  SetMetadata(META_PERMISSION, args);
