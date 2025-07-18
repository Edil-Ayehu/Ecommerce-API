import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);

        if(!requiredRoles) {
            // no roles required, allow access
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        if(!user || !user.role) {
            throw new ForbiddenException('No role assigned!')
        }

        if(!requiredRoles.includes(user.role)) {
            throw new ForbiddenException("You do not have permission to access this resource");
        }

        return true;
    }
}