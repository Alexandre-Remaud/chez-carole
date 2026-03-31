import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import type { Request } from "express"
import { Role } from "../role.enum"
import { ROLES_KEY } from "../decorators/roles.decorator"
import type { JwtPayload } from "../auth.service"

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ])
    if (!requiredRoles) {
      return true
    }
    const request = context.switchToHttp().getRequest<Request>()
    const user = request.user as JwtPayload | undefined
    if (!user) return false
    return requiredRoles.some((role) => user.role === role)
  }
}
