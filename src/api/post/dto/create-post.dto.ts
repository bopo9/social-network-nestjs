import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ description: 'User uuid' })
  readonly userId: string;

  @ApiProperty({ description: 'Post description' })
  readonly description: string;
}
