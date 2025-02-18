import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'module/users/users.service';
import { jwtConstants, Public } from './constants';
import refreshJwtConfig from 'src/config/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';
import { RefreshDto } from './dto/refresh.dto';
import { NormalizedResponse } from 'src/utils/normalize_response.utils';
import { v4 as uuidv4 } from 'uuid'; 
import { LogOutDto } from './dto/logout.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvalidatedToken } from 'entities/invalidated_token.entity';
import { User } from 'entities/user.entity';


//Local Strategy (username & password)
//Oauth2 Strategy (authenticated from other providers: GG, Facebook, etc.)
//JWT Strategy (access token & refresh token)


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY) private refreshTokenConfiguration:ConfigType<typeof refreshJwtConfig>,
    @InjectRepository(InvalidatedToken) private readonly invalidatedTokenRepository:Repository<InvalidatedToken>
  ) {}

  async signIn(username: string, pass: string,): Promise<{ access_token: string, refresh_token: string }> 
  {
    console.log("Service in");
    const user = await this.usersService.checkUsernameExist(username);
    if (!await this.usersService.checkEncryptedPassword(pass,user?.password)) {//user?.password !== pass
      throw new UnauthorizedException();
    }
    const payload_access = { sub: user?.id, username: user?.username, role: user?.role, id: await this.generateTokenId()};
    const payload_refresh = { sub: user?.id, username: user?.username, role: user?.role, id: await this.generateTokenId()};

    return {
      access_token: await this.jwtService.sign(payload_access),
      refresh_token: await this.jwtService.sign(payload_refresh, this.refreshTokenConfiguration)
    };
  }

  public async refresh(refreshDto: RefreshDto) : Promise<NormalizedResponse<{access_token:string}>>{
    console.log(refreshDto.refresh_token);
    const payload = await this.jwtService.verifyAsync(refreshDto.refresh_token, {
      secret: process.env.JWT_REFRESH_SECRET,
    });

    if(!await this.is_in_black_list(payload["id"])){
      let id : string = payload["sub"];
      let username: string = payload["username"];
      let role : string = payload["role"];
      const new_payload = { sub: id, username: username, role: role, id: await this.generateTokenId()};
      let new_access_token:string =  await this.jwtService.sign(new_payload)
      let response : NormalizedResponse<{access_token:string}> = new NormalizedResponse();
      response.result = {access_token : new_access_token};
      return response;
    }
    else{
      throw new UnauthorizedException();
    }
  }
  async log_out(logoutDto: LogOutDto, user_id:string, para_access_token_id:string) : Promise<NormalizedResponse<{user_status:string}>>{
    try {
      const payload_refresh = await this.jwtService.verifyAsync(logoutDto.refresh_token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      //lay ids duoc luu trong tokens
      let access_token_id : string = para_access_token_id;
      let refresh_token_id : string = payload_refresh["id"];
      
      //tao invalidatedToken InvalidatedToken
      let invalidated_access_token : InvalidatedToken = new InvalidatedToken();
      let invalidated_refresh_token : InvalidatedToken = new InvalidatedToken();
      const currentUser:User = await this.usersService.findOne(user_id);
      let time_stamp: Date = new Date();

      invalidated_access_token.id = access_token_id;
      invalidated_access_token.time_stamp = time_stamp;
      invalidated_access_token.user = currentUser;

      invalidated_refresh_token.id = refresh_token_id;
      invalidated_refresh_token.time_stamp = time_stamp;
      invalidated_refresh_token.user = currentUser;

      //luu bang repository (phai inject vao)
      await this.invalidatedTokenRepository.save(invalidated_access_token);
      await this.invalidatedTokenRepository.save(invalidated_refresh_token);

      //Normalize response
      let response : NormalizedResponse<{user_status:string}> = new NormalizedResponse();
      response.result = {user_status : "You have logged out"};
      return response;

    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async is_in_black_list(token_id : string){
    try {
          //Apply pagination
          console.log(token_id);
          const found_invalidated_token = await this.invalidatedTokenRepository.findOne({
            where:{
              id : token_id,
            }
          });
          if(!found_invalidated_token){ //Null
            return false; //Không có trong black list
          }
          return true; //Có trong black list
        } catch (error) {
          throw new NotFoundException();
        }
  }

  private async extractTokenFromHeader(unprocessedToken : string) : Promise<string>{
    const [type, token] = unprocessedToken.split(' ') ?? [];
    return token;
  }

  private async generateTokenId(){
    return uuidv4();
  }

  public async getIdFromToken(unprocessedToken:string) : Promise<string>{
    try {
      const token:string = await this.extractTokenFromHeader(unprocessedToken);
      console.log(token);
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      const userId: string = payload['sub'];
      return userId;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

}
