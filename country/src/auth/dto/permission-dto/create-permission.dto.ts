import { IsIn } from 'class-validator';

export class CreatePermissionDto {
  @IsIn(['read', 'write', 'delete'])
  permisssion: string;
}
