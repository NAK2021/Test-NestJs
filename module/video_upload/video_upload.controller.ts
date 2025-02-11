import { Controller, Get, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { VideoUploadService } from './video_upload.service';
import { Public } from 'module/auth/constants';
import { FileInterceptor } from '@nestjs/platform-express';
import { VideoUploadDto } from './dto/video_upload.dto';

@Controller('video-upload')
export class VideoUploadController {
    constructor(private readonly videoUploadService:VideoUploadService){}

    @Get()
    @Public()
    findAll(){
        return this.videoUploadService.findAll();
    }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    @Public()
    upload(@UploadedFile() file: Express.Multer.File, @Req() req){
        console.log("Upload controller POST");
        console.log(req.headers["authorization"]);
        const token:string = req.headers["authorization"];
        const fileUploadInfoRes = this.videoUploadService.upload(file,token);
        return fileUploadInfoRes;
    }

}
