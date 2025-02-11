import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "module/auth/constants";
import { Role } from "module/auth/util/role.enum";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const { user } = context.switchToHttp().getRequest();
    console.log(user);

    if (!requiredRoles) {
      return true;
    }
    if (!user || !user.role) {
        console.log("user problem");  
        throw new ForbiddenException('User role not found');  
    } 

    const hasRole = () => requiredRoles.indexOf(user.role) > -1;  
    if (hasRole()) {
        console.log("Role affirmative");
        return true; // Chấp nhận quyền truy cập nếu người dùng có role phù hợp
    }   

    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}