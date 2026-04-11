import type { Response } from "express"

const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000

export function setAuthCookies(res: Response, accessToken: string) {
  const isProduction = process.env.NODE_ENV === "production"
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: ACCESS_TOKEN_MAX_AGE,
    path: "/"
  })
}

export function clearAuthCookies(res: Response) {
  const isProduction = process.env.NODE_ENV === "production"
  res.clearCookie("access_token", {
    path: "/",
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax"
  })
}

export function setRefreshCookie(res: Response, refreshToken: string) {
  const isProduction = process.env.NODE_ENV === "production"
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: REFRESH_TOKEN_MAX_AGE,
    path: "/auth/refresh"
  })
}

export function clearRefreshCookie(res: Response) {
  const isProduction = process.env.NODE_ENV === "production"
  res.clearCookie("refresh_token", {
    path: "/auth/refresh",
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax"
  })
}
