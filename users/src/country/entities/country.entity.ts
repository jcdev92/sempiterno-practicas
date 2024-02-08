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
  })
  code: string;

  @OneToMany(() => User, (user) => user.country)
  user: User;

  @BeforeInsert()
  @BeforeUpdate()
  generateAbbreviation() {
    if (this.name) {
      // check if this.name have two words
      const codesArr = [];
      if (this.name.split(' ').length > 1) {
        const initials = this.name
          .toUpperCase()
          .match(/\b\w/g)
          ?.join('')
          .substring(0, 3);
        this.code = initials || '';
        codesArr.push(this.code);
        return;
      }
      const initials = this.name.toUpperCase().substring(0, 2);
      codesArr.push(initials);

      this.code = initials || '';
    }
  }
}
