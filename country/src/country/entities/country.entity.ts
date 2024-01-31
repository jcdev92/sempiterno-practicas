import { User } from 'src/auth/entities';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('country')
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', {
    nullable: false,
    unique: true,
  })
  name: string;

  @Column('text', {
    nullable: false,
    unique: true,
  })
  code: string;

  @OneToMany(() => User, (user) => user.country)
  user: User;

  @BeforeInsert()
  @BeforeUpdate()
  generateAbbreviation() {
    if (this.name) {
      const initials = this.name.toUpperCase().match(/\b\w/g)?.join('');

      this.code = initials || '';
    }
  }
}
