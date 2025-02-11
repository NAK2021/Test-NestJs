import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'module/users/users.service';
import { jwtConstants, Public } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string,): Promise<{ access_token: string }> 
  {
    console.log("Service in");
    const user = await this.usersService.checkUsernameExist(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.username, role: user.role};
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  private async extractTokenFromHeader(unprocessedToken) : Promise<string>{
    const [type, token] = unprocessedToken.split(' ') ?? [];
    return token;
  }

  public async getIdFromToken(unprocessedToken:string) : Promise<string>{
    try {
      const token:string = await this.extractTokenFromHeader(unprocessedToken);
      console.log(token);
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      const userId: string = payload['sub'];
      return userId;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  
}
