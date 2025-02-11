import { IsString, Length } from "class-validator";

export class CreateUserDto{

    @IsString()
    username:string

    @IsString()
    @Length(8,16,{message: "error on length"})
    password:string
}