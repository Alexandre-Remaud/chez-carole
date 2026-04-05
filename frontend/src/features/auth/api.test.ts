import { describe, it, expect, vi, beforeEach } from "vitest"
import { authApi, AuthError } from "./api"

vi.mock("@/lib/api-client", () => ({
  apiFetch: vi.fn()
}))

import { apiFetch } from "@/lib/api-client"

describe("authApi", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("register", () => {
    it("should call apiFetch with correct params", async () => {
      const mockResponse = { user: { _id: "1", email: "t@t.com" } }
      vi.mocked(apiFetch).mockResolvedValue(mockResponse)

      const result = await authApi.register({
        email: "t@t.com",
        password: "Password1",
        name: "Test"
      })

      expect(apiFetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/register"),
        expect.objectContaining({
          method: "POST",
          credentials: "include"
        })
      )
      expect(result).toEqual(mockResponse)
    })
  })

  describe("login", () => {
    it("should call apiFetch with correct params", async () => {
      const mockResponse = { user: { _id: "1", email: "t@t.com" } }
      vi.mocked(apiFetch).mockResolvedValue(mockResponse)

      const result = await authApi.login({
        email: "t@t.com",
        password: "Password1"
      })

      expect(apiFetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/login"),
        expect.objectContaining({
          method: "POST",
          credentials: "include"
        })
      )
      expect(result).toEqual(mockResponse)
    })
  })

  describe("refresh", () => {
    it("should call POST /auth/refresh", async () => {
      vi.mocked(apiFetch).mockResolvedValue({ message: "ok" })

      await authApi.refresh()

      expect(apiFetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/refresh"),
        expect.objectContaining({
          method: "POST",
          credentials: "include"
        })
      )
    })
  })

  describe("logout", () => {
    it("should call POST /auth/logout", async () => {
      vi.mocked(apiFetch).mockResolvedValue({ message: "ok" })

      await authApi.logout()

      expect(apiFetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/logout"),
        expect.objectContaining({
          method: "POST",
          credentials: "include"
        })
      )
    })
  })

  describe("getProfile", () => {
    it("should call GET /auth/me", async () => {
      const mockUser = { id: "1", email: "t@t.com", role: "user" }
      vi.mocked(apiFetch).mockResolvedValue(mockUser)

      const result = await authApi.getProfile()

      expect(apiFetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/me"),
        expect.objectContaining({
          method: "GET",
          credentials: "include"
        })
      )
      expect(result).toEqual(mockUser)
    })
  })
})

describe("AuthError", () => {
  it("should have correct name and message", () => {
    const error = new AuthError("test error")
    expect(error.name).toBe("AuthError")
    expect(error.message).toBe("test error")
    expect(error).toBeInstanceOf(Error)
  })
})
