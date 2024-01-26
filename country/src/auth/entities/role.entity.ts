import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Permission } from './permission.entity';

@Entity({
  name: 'role',
})
export class Role {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
  })
  id: number;

  @Column('text', {
    unique: true,
    nullable: false,
    default: 'user',
  })
  title: string;

  @ManyToMany(() => Permission)
  @JoinTable()
  permission: Permission[];
}
