import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export class CreatePermissionDto {
  @IsIn(['read', 'write', 'delete', 'administator'])
  @ApiProperty({ enum: ['read', 'write', 'delete', 'administator'] })
  permisssion: string;
}
