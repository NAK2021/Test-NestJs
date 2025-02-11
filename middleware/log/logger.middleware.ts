import { Injectable, NestMiddleware } from "@nestjs/common";

//Consider using the simpler functional middleware alternative any time 
// your middleware doesn't need any dependencies.

@Injectable()
export class LoggerMiddleware implements NestMiddleware{
    use(req: any, res: any, next: (error?: any) => void) {
        console.log('Request...');
        next();
    }
}