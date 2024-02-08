// import { PartialType } from '@nestjs/mapped-types';
import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @ApiProperty({
    example: 'ADMIN',
    description: 'Role title',
    uniqueItems: true,
    minLength: 1,
    maxLength: 50,
    default: 'ADMIN',
    nullable: false,
    type: String,
  })
  title?: string;

  @ApiProperty({
    example: ['read', 'write'],
    description: 'Permissions',
    type: [String],
  })
  permissions?: string[];
}
