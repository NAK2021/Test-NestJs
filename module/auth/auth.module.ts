import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from 'module/users/users.service';
import { UsersModule } from 'module/users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { ConfigModule } from '@nestjs/config';
import { LocalStrategy } from './strategies/local.auth.strategies';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'entities/user.entity';
import jwtConfig from 'src/config/jwt.config';
import refreshJwtConfig from 'src/config/refresh-jwt.config';
import { InvalidatedToken } from 'entities/invalidated_token.entity';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([InvalidatedToken]),
    // JwtModule.register({
    //   global: true,
    //   secret: jwtConstants.secret,
    //   signOptions: { expiresIn: '60s'}
    // }),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshJwtConfig),
  ],  
  controllers: [AuthController],
  providers: [AuthService ,LocalStrategy],
  exports: [AuthService]
})
export class AuthModule {}
