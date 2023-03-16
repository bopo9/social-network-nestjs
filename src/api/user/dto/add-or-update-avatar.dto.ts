import { ApiProperty } from '@nestjs/swagger';

export class AddOrUpdateAvatarDto {
  @ApiProperty({
    example: 'UUID',
    description: 'UUID',
    type: 'uuid',
    required: true,
  })
  readonly userId: string;

  @ApiProperty({
    description: 'File key in bucket',
    type: 'varchar',
    required: true,
  })
  readonly fileKey: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Image file to upload',
  })
  readonly avatar: string;
}
