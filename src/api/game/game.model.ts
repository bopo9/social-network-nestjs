import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany } from 'typeorm';
import { UserModel } from '../user/user.model';

@Entity('games')
export class Game {
  @PrimaryGeneratedColumn('uuid')
  public id: number;

  @Column({
    type: 'varchar',
    length: 120,
    nullable: false,
  })
  public title: string;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: false,
  })
  public description: string;

  @ManyToMany(() => UserModel, (author: UserModel) => author.posts)
  public user?: UserModel;
}
