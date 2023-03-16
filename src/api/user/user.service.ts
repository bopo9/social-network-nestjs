import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from './user.model';
import { Repository } from 'typeorm';
import { S3Service } from '../../services/s3/s3.service';
import { AddOrUpdateAvatarDto } from './dto/add-or-update-avatar.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserModel)
    private readonly repository: Repository<UserModel>,
    private s3Service: S3Service,
  ) {}
  public async createUser(
    userDto: CreateUserDto,
    file: Express.Multer.File,
  ): Promise<UserModel> {
    const user: UserModel = await this.repository.save(userDto);
    delete user.password;

    const bucketKey = `avatar-${user.id}`;

    user.avatar = await this.s3Service.uploadFile(file, bucketKey);

    await this.repository.update({ id: user.id }, user);

    return user;
  }

  public async updateAvatar(
    file: Express.Multer.File,
    dto: AddOrUpdateAvatarDto,
  ): Promise<UserModel> {
    try {
      const user = this.getUserById(dto.userId);

      const bucketKeyDelete = `${dto.fileKey}-${dto.userId}`;
      const response = await this.s3Service.deleteFile(bucketKeyDelete);

      if (response.status !== 204) {
        throw new HttpException(
          { message: 'Oops, something went wrong, please try again later' },
          500,
        );
      }

      const bucketKey = `${dto.fileKey}-${dto.userId}`;

      const avatarLink = await this.s3Service.uploadFile(file, bucketKey);

      await this.repository.update(
        { id: dto.userId },
        {
          avatar: avatarLink,
        },
      );

      return user;
    } catch (err) {
      throw new InternalServerErrorException(
        'Oops, something went wrong, try again later',
      );
    }
  }

  public async getUserById(id: string): Promise<UserModel> {
    const user = await this.repository.findOne({
      where: { id },
      relations: ['posts'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
