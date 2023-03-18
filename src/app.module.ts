import { Module } from '@nestjs/common';
import { UserModule } from './api/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './api/user/user.model';
import { PostModule } from './api/post/post.module';
import { MulterModule } from '@nestjs/platform-express';
import { Post } from './api/post/post.model';
import { S3Service } from './services/s3/s3.service';
import { S3Module } from './services/s3/s3.module';
import { UserService } from './api/user/user.service';
import { GameModule } from './api/game/game.module';
import { Game } from './api/game/game.model';

@Module({
  imports: [
    UserModule,
    PostModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.production', '.env.development'],
    }),
    MulterModule.register({
      dest: './files',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [UserModel, Post, Game],
        synchronize: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    S3Module,
    GameModule,
  ],
  providers: [S3Service],
})
export class AppModule {}
