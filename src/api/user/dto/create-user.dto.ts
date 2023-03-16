import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'email@gmail.com', description: 'email' })
  readonly email: string;

  @ApiProperty({ example: 'First name', description: 'first name' })
  readonly firstName: string;

  @ApiProperty({ example: 'Last name', description: 'last name' })
  readonly lastName: string;

  @ApiProperty({ example: '18', description: 'age' })
  readonly age: number;

  @ApiProperty({ example: '123wasd', description: 'password' })
  readonly password: string;

  @ApiProperty({ example: 'false', description: 'isBanned'})
  readonly isBanned: boolean;
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Image file to upload',
  })
  readonly avatar: string;
}
