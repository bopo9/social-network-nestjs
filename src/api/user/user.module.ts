import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './user.model';
import { S3Module } from '../../services/s3/s3.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel]), S3Module],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
