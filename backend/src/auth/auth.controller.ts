import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Get,
  Req
} from "@nestjs/common"
import { Throttle } from "@nestjs/throttler"
import type { Response, Request } from "express"
import { AuthService } from "./auth.service"
import { RegisterDto } from "./dto/register.dto"
import { LoginDto } from "./dto/login.dto"
import { Public } from "./decorators/public.decorator"
import { CurrentUser } from "./decorators/current-user.decorator"
import {
  setAuthCookies,
  clearAuthCookies,
  setRefreshCookie,
  clearRefreshCookie
} from "./utils/cookies.util"
import type { JwtPayload } from "./auth.service"

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post("register")
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.authService.register(registerDto)
    setAuthCookies(res, result.accessToken)
    setRefreshCookie(res, result.refreshToken)
    return { user: result.user }
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.authService.login(loginDto)
    setAuthCookies(res, result.accessToken)
    setRefreshCookie(res, result.refreshToken)
    return { user: result.user }
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const refreshToken = req.cookies?.refresh_token as string | undefined
    if (!refreshToken) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "Refresh token manquant" })
      return
    }

    const tokens = await this.authService.refreshTokens(refreshToken)
    setAuthCookies(res, tokens.accessToken)
    setRefreshCookie(res, tokens.refreshToken)
    return { message: "Tokens refreshed" }
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout(
    @Res({ passthrough: true }) res: Response,
    @CurrentUser() user: JwtPayload
  ) {
    await this.authService.logout(user.sub)
    clearAuthCookies(res)
    clearRefreshCookie(res)
    return { message: "Déconnexion réussie" }
  }

  @Get("me")
  async getProfile(@CurrentUser() user: JwtPayload) {
    const fullUser = await this.authService.validateUser(user)
    if (!fullUser) {
      return {
        id: user.sub,
        email: user.email,
        name: user.name,
        role: user.role
      }
    }
    const { password: _password, __v: _v, ...rest } = fullUser.toObject()
    return rest
  }
}
