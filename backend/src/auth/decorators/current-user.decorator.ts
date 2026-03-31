import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import type { Request } from "express"
import type { JwtPayload } from "../auth.service"

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>()
    const user = request.user as JwtPayload | undefined
    if (!user) return undefined
    return data ? user[data as keyof JwtPayload] : user
  }
)
