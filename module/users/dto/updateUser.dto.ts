import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./createUser.dto";

//In CreateUserDto all of these fields are required. 
// To create a type with the same fields, but with each one optiona
export class UpdateUserDto extends PartialType(CreateUserDto) {

}