import { Module } from '@nestjs/common';
import { VideoUploadController } from './video_upload.controller';
import { VideoUploadService } from './video_upload.service';
import { UsersModule } from 'module/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoUpload } from 'entities/video_upload.entity';
import { AuthModule } from 'module/auth/auth.module';

@Module({
  imports: [UsersModule, AuthModule, TypeOrmModule.forFeature([VideoUpload])],
  controllers: [VideoUploadController],
  providers: [VideoUploadService],
  exports: [VideoUploadService]
})
export class VideoUploadModule {}
