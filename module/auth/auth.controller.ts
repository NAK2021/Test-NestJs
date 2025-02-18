import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Request, UseFilters, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from 'middleware/guard/auth.guard';
import { Public, Roles } from './constants';
import { Role } from './util/role.enum';
import { RefreshDto } from './dto/refresh.dto';
import { LogOutDto } from './dto/logout.dto';
import { HttpExceptionFilter } from 'middleware/filter/http_exception.filter';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  // @UseGuards(PassportGuard('local')) 
  //Request will go through the PassportGuard look for the strategy to check user authentication
  //Strategy has been specified in auth.strategies
  signIn(@Body() loginDto: LoginDto) {
    console.log("In");
    return this.authService.signIn(loginDto.username, loginDto.password);
  }

  @Public()
  @HttpCode(200)
  @Post('refresh')
  refreshToken(@Body() refreshDto: RefreshDto){
    return this.authService.refresh(refreshDto);
  }

  @UseGuards(AuthGuard) //With AuthGuard, we can determine which strategy we want to apply
  @Roles(Role.ADMIN)
  @UseFilters(new HttpExceptionFilter())
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
  //@Req(): Dùng để truy cập thông tin từ yêu cầu. Thích hợp khi bạn cần lấy dữ liệu từ client.
  //@Res(): Dùng để điều khiển phản hồi gửi lại cho client. Thích hợp khi bạn muốn tùy chỉnh cách trả dữ liệu.

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Post('log-out')
  log_out(@Body() logoutDto: LogOutDto, @Req() req){
    return this.authService.log_out(logoutDto,req.user["sub"],req.user["id"]);
  }
}
