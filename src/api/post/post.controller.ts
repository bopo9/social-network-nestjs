import { Body, Controller, Post } from '@nestjs/common';
import { PostService } from './post.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Post()
  @ApiOperation({ summary: 'Create post' })
  @ApiResponse({ status: 201, type: Post })
  public createPost(@Body() postDto: CreatePostDto) {
    return this.postService.createPost(postDto);
  }
}
