import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { Request } from 'express';
import { AuthService } from 'module/auth/auth.service';
import { IS_PUBLIC_KEY, jwtConstants } from 'module/auth/constants';
import { HandlerException } from 'src/utils/global_handle_exception.utils';
import { NormalizedResponse } from 'src/utils/normalize_response.utils';

@Injectable()
export class AuthGuard implements CanActivate {
  private failed_response: HandlerException = new HandlerException(
    new UnauthorizedException().getStatus(),
    "Người dùng không có quyền truy cập"
  );
        // failed_response.message = "Người dùng không có quyền truy cập"
        // failed_response.status_code = new UnauthorizedException().getStatus();


  constructor(private jwtService: JwtService, 
    private reflector: Reflector, 
    private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {//No auth route  
      // 💡 See this condition
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    let role:string;
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      // We should somehow check the expire date


      if(!await this.authService.is_in_black_list(payload["id"])){
        request['user'] = payload;
        role = payload["role"];
        console.log(role);
      }
      else{
        // const failed_response: HandlerException = new HandlerException();
        // failed_response.message = "Người dùng không có quyền truy cập"
        // failed_response.status_code = new UnauthorizedException().getStatus();
        this.failed_response.message = "Token không hợp lệ"
        throw this.failed_response;
      }
    } catch {
      throw this.failed_response;
    }
    return true;
  }

  public extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
