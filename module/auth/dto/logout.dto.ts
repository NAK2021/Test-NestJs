import { IsString } from "class-validator";

export class LogOutDto {

  @IsString()
  refresh_token: string;
}  