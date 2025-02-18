import { registerAs } from "@nestjs/config";
import { JwtModuleOptions } from "@nestjs/jwt";
import { config } from "dotenv";

config()
export default registerAs(
  'jwt', //this is a key
  (): JwtModuleOptions => ({
    global: true,
    secret: process.env.JWT_SECRET,
    signOptions: {
      expiresIn: process.env.JWT_EXPIRE_IN,
    },
  }),
);