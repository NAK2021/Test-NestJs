import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { Role } from 'module/auth/util/role.enum';

// export type User = any; //Alias

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private readonly userRepository:Repository<User>){}

//   private readonly users = [
//     {
//       userId: 1,
//       username: 'john',
//       password: 'changeme',
//     },
//     {
//       userId: 2,
//       username: 'maria',
//       password: 'guess',
//     },
//   ];

  async findOne(id: string) : Promise<User>{
    try {
      //Apply pagination
      const foundUser = await this.userRepository.findOne({
        where:{
          id,
        }
      });
      if(!foundUser){ //Null
        throw new NotFoundException();
      }
      return foundUser;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async checkUsernameExist(username: string){
    try {
      //Apply pagination
      const foundUser = await this.userRepository.findOne({
        where:{
          username,
        }
      });
      return foundUser;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async findAll() {
    return this.userRepository.find(); 
  }

  async create(userDto:CreateUserDto) {
    let newUser:User = new User();
    newUser.username = userDto.username;
    newUser.password = userDto.password;
    newUser.role = await this.decideRoles(newUser.username);

    return await this.userRepository.save(newUser);
  }

  async decideRoles(username:string):Promise<string>{
    if(username.includes("admin")){
      if(username.includes("super")){
        return Role.SUPER_ADMIN;
      }
      return Role.ADMIN;
    }
    else if(username.includes("lecturer")){
      return Role.LECTURER
    }
    return "undefined";
  }

  async update(id:string, updateDto: UpdateUserDto) {
    return await this.userRepository.update({id}, updateDto); //({keys}, updated_info)
  }

  async delete(id:string) {
    return await this.userRepository.delete({id});
  }
}
