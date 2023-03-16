import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserModel } from '../user/user.model';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({
    type: 'varchar',
    length: 2048,
    nullable: false,
  })
  public description: string;

  @ManyToOne(() => UserModel, (author: UserModel) => author.posts)
  public author: UserModel;
}
