import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinTable } from 'typeorm';
import { Post } from '../post/post.model';
import { Exclude } from 'class-transformer';

@Entity('users')
export class UserModel {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ unique: false })
  public username: string;

  @Column({ unique: false })
  public email: string;

  @Column()
  public age: number;

  @Column({ length: 70 })
  public firstName: string;

  @Column({ length: 70 })
  public lastName: string;

  @Exclude({ toPlainOnly: false })
  @Column({ select: false })
  public password: string;

  @Column({ default: false })
  public isBanned: boolean;

  @Column({ nullable: true })
  public avatar: string;

  @OneToMany(() => Post, (post: Post) => post.author)
  @JoinTable()
  public posts: Post[];
}
