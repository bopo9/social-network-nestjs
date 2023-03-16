import { Inject, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.model';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly repository: Repository<Post>,
    @Inject(UserService)
    private userService: UserService,
  ) {}
  public async createPost(postDto: CreatePostDto) {
    const user = await this.userService.getUserById(postDto.userId);
    delete user.posts;

    const post = await this.repository.create({
      description: postDto.description,
      author: user,
    });

    await this.repository.save(post);

    return post;
  }

  public async getAllPosts(){

  }
}
