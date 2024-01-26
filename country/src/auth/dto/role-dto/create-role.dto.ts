import { IsIn } from 'class-validator';

export class CreateRoleDto {
  @IsIn(['administrator', 'user'])
  name: string;
}
