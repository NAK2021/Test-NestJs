import { SetMetadata } from "@nestjs/common";
import { Role } from "./util/role.enum";

export const jwtConstants = {
    secret: 'uRzsIk0YFkKUMoB1ZHc1yjElBwEk+wLdL5d/UR7CQmCr1U+TabszeonVBh9/sNud',
}; //Protect this key at all cost

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export const DEFAULT_PAGE_SIZE : number = 10;