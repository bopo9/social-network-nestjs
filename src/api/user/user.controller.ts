import {
  Body,
  Controller,
  Get, Param, ParseUUIDPipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserModel } from './user.model';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddOrUpdateAvatarDto } from './dto/add-or-update-avatar.dto';
import { imageTypeValidation } from '../../core/validations/image-type-validation.helper';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, type: UserModel })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('avatar', {
      limits: {
        fileSize: 10485760,
      },
      fileFilter: imageTypeValidation,
    }),
  )
  public createUser(
    @UploadedFile() file: Express.Multer.File,
    @Body() userDto: CreateUserDto,
  ) {
    return this.userService.createUser(userDto, file);
  }

  @Put('/avatar')
  @ApiOperation({ summary: 'Update user avatar' })
  @ApiResponse({ status: 200, type: UserModel })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('avatar', {
      limits: {
        fileSize: 10485760,
      },
      fileFilter: imageTypeValidation,
    }),
  )
  public addOrUpdateAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Body('userId', new ParseUUIDPipe()) userDto: AddOrUpdateAvatarDto,
  ): Promise<UserModel> {
    return this.userService.updateAvatar(file, userDto);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'get user by id' })
  @ApiResponse({ status: 200, type: UserModel })
  public async getUserById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<UserModel> {
    return await this.userService.getUserById(id);
  }
}
