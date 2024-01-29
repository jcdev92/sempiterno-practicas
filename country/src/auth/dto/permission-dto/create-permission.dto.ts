import { IsIn } from 'class-validator';

export class CreatePermissionDto {
  @IsIn(['read', 'write'])
  permisssion: string;
}