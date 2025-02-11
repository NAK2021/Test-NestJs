import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from 'middleware/guard/auth.guard';
import { Public, Roles } from './constants';
import { Role } from './util/role.enum';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  signIn(@Body() loginDto: LoginDto) {
    console.log("In");
    return this.authService.signIn(loginDto.username, loginDto.password);
  }

  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
  //@Req(): Dùng để truy cập thông tin từ yêu cầu. Thích hợp khi bạn cần lấy dữ liệu từ client.
  //@Res(): Dùng để điều khiển phản hồi gửi lại cho client. Thích hợp khi bạn muốn tùy chỉnh cách trả dữ liệu.
}
