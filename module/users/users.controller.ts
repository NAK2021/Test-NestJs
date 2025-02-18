import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Public } from 'module/auth/constants';
import { CreateUserDto } from './dto/createUser.dto';
import { UsersService } from './users.service';
import { UpdateDescription } from 'typeorm';
import { UpdateUserDto } from './dto/updateUser.dto';
import { PaginationDto } from 'dto/pagination.dto';

@Controller('users')
export class UsersController {

    constructor(private readonly userService:UsersService){}

    @Get()
    @Public()
    findAll(@Query() paginationDto : PaginationDto){
        return this.userService.findAll(paginationDto);
    }


    @Post()
    @Public()
    create(@Body() userDto:CreateUserDto){
        return this.userService.create(userDto);
    }

    @Get(":id")
    @Public()
    findOne(@Param("id") id){
        return this.userService.findOne(id);
    }

    @Patch(":id")
    @Public()
    update(
        @Param("id") id,
        @Body() updatedUserDto:UpdateUserDto
    ){
        return this.userService.update(id,updatedUserDto);
    }

    @Delete(":id")
    @Public()
    delete(@Param("id") id){
        return this.userService.delete(id);
    }
}
