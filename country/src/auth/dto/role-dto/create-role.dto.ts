import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString({ each: true })
  title: string;

  @IsArray()
  @IsOptional()
  permissions?: string[];
}
