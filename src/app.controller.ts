import { Controller, ForbiddenException, Get, HttpException, HttpStatus, UseFilters } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from 'module/auth/constants';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
