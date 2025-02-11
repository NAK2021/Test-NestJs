import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { existsSync, mkdirSync } from 'fs';
import { UsersService } from 'module/users/users.service';
import { Repository } from 'typeorm';
import { VideoUploadDto } from './dto/video_upload.dto';
import { join } from 'path';
import { VideoUpload } from 'entities/video_upload.entity';
import { AuthService } from 'module/auth/auth.service';
import { User } from 'entities/user.entity';

@Injectable()
export class VideoUploadService {

    private readonly UPLOAD_PATH = './resources/image'; 

  constructor(
    private readonly usersService: UsersService,
    private readonly authService:AuthService,
    @InjectRepository(VideoUpload)
    private readonly videoUploadRepository: Repository<VideoUpload>,
  ) {
    if (!existsSync(this.UPLOAD_PATH)) {  //Nếu không tìm thấy thư mục, tạo thư mục đó
        mkdirSync(this.UPLOAD_PATH);  
    }  
  }


  async findAll() {
    return await this.videoUploadRepository.find();
  }

  async upload(file: Express.Multer.File, token:string): Promise<VideoUploadDto | undefined>{
    try {
        console.log("Upload service POST");
        const filePath = join(this.UPLOAD_PATH, file.originalname);  
        // Di chuyển file đến thư mục uploads  
        await new Promise((resolve, reject) => {  
            const writeStream = require('fs').createWriteStream(filePath);  
            writeStream.on('finish', resolve);  
            writeStream.on('error', reject);  
            writeStream.write(file.buffer);  
            writeStream.end();  
        });

        console.log("Saved file");

        //Save vào DB
        let videoUpload:VideoUpload = new VideoUpload();
        videoUpload.image_name = file.originalname;
        videoUpload.image_path = filePath;
        
        //Get userId from token
        const userId:string = await this.authService.getIdFromToken(token);
        const currentUser:User = await this.usersService.findOne(userId);
        videoUpload.user = currentUser;
        await this.videoUploadRepository.save(videoUpload);

        console.log("Saved db");

        //Tạo DTO response để trả về
        let videoUploadDtoRes:VideoUploadDto = new VideoUploadDto();
        videoUploadDtoRes.image_name = file.originalname;
        videoUploadDtoRes.image_path = filePath;
        console.log("Return path");
        return videoUploadDtoRes;

    } catch (error) {
        console.log(error);
        throw new RequestTimeoutException("Upload failed");
    } 
  }



}
