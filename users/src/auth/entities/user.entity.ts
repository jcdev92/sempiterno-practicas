import { Country } from 'src/country/entities/country.entity';
import { Role } from './role.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
    nullable: false,
  })
  email: string;

  @Column('text', {
    nullable: false,
    select: false,
  })
  password: string;

  @Column('text', {
    name: 'full_name',
  })
  fullName: string;

  @Column('bool', {
    name: 'is_active',
    default: true,
    nullable: false,
  })
  isActive: boolean;

  @ManyToOne(() => Country, (country) => country.user, {
    nullable: true,
    eager: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
    cascade: ['insert', 'update'],
  })
  country: Country;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_role',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  role: Role[];

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFiledsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
