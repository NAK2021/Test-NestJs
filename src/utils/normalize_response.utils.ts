export class NormalizedResponse<T>{
    isSuccess: boolean = true;
    status_code : number = 200;
    message: string = "Successfully"; 
    result: T;
    time_stamp: Date = new Date();
    constructor(){}
}