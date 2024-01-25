import { IsIn } from 'class-validator';

export class CreateRolDto {
  @IsIn(['administrator', 'user'])
  name: string;
}
