import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'permission',
})
export class Permission {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
  })
  id: number;

  @Column('text', {
    unique: true,
    nullable: false,
  })
  title: string;
}
