import { HttpException } from "@nestjs/common";

export class HandlerException extends HttpException{
    isSuccess: boolean = false;
    status_code : number;
    message: string;
    time_stamp: Date = new Date();

    constructor(para_status_code : number, para_message: string){
        super(para_message, para_status_code);
        this.status_code = para_status_code;
        this.message = para_message;
    }
}