import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export class CreatePermissionDto {
  @IsIn(['administator', 'read', 'write', 'delete'])
  @ApiProperty({ enum: ['administator', 'read', 'write', 'delete'] })
  permisssion: string;
}
