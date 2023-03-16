import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
  private logger = new Logger(S3Service.name);
  private region: string;
  private s3: S3Client;
  private bucket: string;

  constructor(private configService: ConfigService) {
    this.region = configService.get<string>('S3_REGION');
    this.s3 = new S3Client({
      region: this.region,
      credentials: {
        secretAccessKey: configService.get<string>('S3_ACCESS_KEY'),
        accessKeyId: configService.get<string>('S3_ACCESS_KEY_ID'),
      },
    });
    this.bucket = this.configService.get<string>('S3_BUCKET');
  }

  async uploadFile(file: Express.Multer.File, key: string): Promise<string> {
    const input: PutObjectCommandInput = {
      Body: file.buffer,
      Bucket: this.bucket,
      Key: key,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    try {
      const response: PutObjectCommandOutput = await this.s3.send(
        new PutObjectCommand(input),
      );

      if (response.$metadata.httpStatusCode === 200) {
        return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
      }

      throw new Error('Image not saved in s3!');
    } catch (err) {
      this.logger.error('Cannot save file to s3,', err);
      throw err;
    }
  }

  async getFile(fileId: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: fileId,
    });

    try {
      const response = await this.s3.send(command);

      if (response.$metadata.httpStatusCode === 204) {
        return response.Body;
      }

      throw new Error('Image not found in s3!');
    } catch (err) {
      this.logger.error('Cannot get file from s3,', err);
      throw err;
    }
  }

  async deleteFile(fileId: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: fileId,
    });
    try {
      const response: PutObjectCommandOutput = await this.s3.send(command);

      if (response.$metadata.httpStatusCode === 204) {
        return Promise.resolve({
          status: response.$metadata.httpStatusCode,
          response: response.$metadata,
        });
      }

      throw new Error('Image not deleted in s3!');
    } catch (err) {
      this.logger.error('Cannot delete file from s3,', err);
      throw err;
    }
  }
}
