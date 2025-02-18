import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private authService: AuthService){
        super({
             usernameField: "username", //define by your own
             passwordField: "password", //define by your own
        })
    }
    validate(username : string, password : string) { //this is an overide function
        console.log("Validate");
        return this.authService.signIn(username,password);
    }
}