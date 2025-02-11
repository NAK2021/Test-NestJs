import { IsDate, IsString } from "class-validator"

export class VideoUploadDto{

    @IsString()
    image_name:string

    @IsString()
    image_path:string

    @IsDate()
    uploadedAt:Date
}