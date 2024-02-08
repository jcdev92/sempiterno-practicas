import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString({ each: true })
  @ApiProperty({
    example: 'ADMIN',
    description: 'Role title',
    uniqueItems: true,
    minLength: 1,
    maxLength: 50,
    default: 'ADMIN',
    nullable: false,
    required: true,
    type: String,
  })
  title: string;

  @IsArray()
  @IsOptional()
  @ApiProperty({
    example: ['read', 'write'],
    description: 'Permissions',
    type: [String],
  })
  permissions?: string[];
}
