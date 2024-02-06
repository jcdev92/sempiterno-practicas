import { IsIn } from 'class-validator';

export class CreateRoleDto {
  @IsIn(['admin', 'user'])
  title: string;
}
