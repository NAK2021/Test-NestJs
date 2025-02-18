import { registerAs } from "@nestjs/config";
import { JwtModuleOptions, JwtSignOptions } from "@nestjs/jwt";
import { config } from "dotenv";

config()
export default registerAs(
  'refresh-jwt', //this is a key
  (): JwtSignOptions => ({
    // global: true,
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: process.env.JWT_REFRESH_EXPIRE_IN,
  }),
);