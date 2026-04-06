import { Test, TestingModule } from "@nestjs/testing"
import { getModelToken } from "@nestjs/mongoose"
import { JwtService } from "@nestjs/jwt"
import { ConflictException, UnauthorizedException } from "@nestjs/common"
import * as bcrypt from "bcrypt"
import { AuthService } from "./auth.service"
import { User } from "../users/entities/user.entity"
import { RefreshToken } from "./entities/refresh-token.entity"
import { Types } from "mongoose"
import { Role } from "./role.enum"

jest.mock("bcrypt")

describe("AuthService", () => {
  let service: AuthService
  let userModel: Record<string, jest.Mock>
  let refreshTokenModel: Record<string, jest.Mock>
  let jwtService: { sign: jest.Mock; verify: jest.Mock }

  const mockUserId = new Types.ObjectId()
  const mockUser = {
    _id: mockUserId,
    email: "test@example.com",
    name: "Test User",
    password: "hashedPassword",
    role: Role.USER,
    toObject: jest.fn().mockReturnValue({
      _id: mockUserId,
      email: "test@example.com",
      name: "Test User",
      password: "hashedPassword",
      role: Role.USER,
      __v: 0
    })
  }

  beforeEach(async () => {
    userModel = {
      exists: jest.fn().mockReturnValue({ lean: jest.fn() }),
      create: jest.fn(),
      findOne: jest.fn(),
      findById: jest.fn()
    }
    refreshTokenModel = {
      create: jest.fn(),
      deleteMany: jest.fn(),
      deleteOne: jest.fn(),
      find: jest.fn()
    }
    jwtService = {
      sign: jest.fn().mockReturnValue("mock-token"),
      verify: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken(User.name), useValue: userModel },
        {
          provide: getModelToken(RefreshToken.name),
          useValue: refreshTokenModel
        },
        { provide: JwtService, useValue: jwtService }
      ]
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  describe("register", () => {
    it("should register a new user and return tokens", async () => {
      userModel.exists.mockReturnValue({
        lean: jest.fn().mockResolvedValue(null)
      })
      ;(bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword")
      userModel.create.mockResolvedValue(mockUser)
      refreshTokenModel.deleteMany.mockResolvedValue({})
      refreshTokenModel.create.mockResolvedValue({})

      const result = await service.register({
        email: "Test@Example.com",
        password: "Password1",
        name: "Test User"
      })

      expect(result.user).toBeDefined()
      expect(result.user).not.toHaveProperty("password")
      expect(result.user).not.toHaveProperty("__v")
      expect(result.accessToken).toBe("mock-token")
      expect(result.refreshToken).toBe("mock-token")
      expect(userModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "test@example.com",
          name: "Test User"
        })
      )
    })

    it("should throw ConflictException if email already exists", async () => {
      userModel.exists.mockReturnValue({
        lean: jest.fn().mockResolvedValue({ _id: "existing" })
      })

      await expect(
        service.register({
          email: "test@example.com",
          password: "Password1",
          name: "Test"
        })
      ).rejects.toThrow(ConflictException)
    })
  })

  describe("login", () => {
    it("should login with valid credentials", async () => {
      userModel.findOne.mockResolvedValue(mockUser)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)
      ;(bcrypt.hash as jest.Mock).mockResolvedValue("hashedRefresh")
      refreshTokenModel.deleteMany.mockResolvedValue({})
      refreshTokenModel.create.mockResolvedValue({})

      const result = await service.login({
        email: "test@example.com",
        password: "Password1"
      })

      expect(result.user).toBeDefined()
      expect(result.accessToken).toBe("mock-token")
      expect(result.refreshToken).toBe("mock-token")
    })

    it("should throw UnauthorizedException if user not found", async () => {
      userModel.findOne.mockResolvedValue(null)

      await expect(
        service.login({ email: "notfound@example.com", password: "Password1" })
      ).rejects.toThrow(UnauthorizedException)
    })

    it("should throw UnauthorizedException if password is wrong", async () => {
      userModel.findOne.mockResolvedValue(mockUser)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

      await expect(
        service.login({ email: "test@example.com", password: "Wrong1234" })
      ).rejects.toThrow(UnauthorizedException)
    })
  })

  describe("refreshTokens", () => {
    it("should return new tokens with a valid refresh token", async () => {
      const storedToken = {
        _id: new Types.ObjectId(),
        userId: mockUserId.toString(),
        token: "hashedToken",
        expiresAt: new Date(Date.now() + 86400000)
      }

      jwtService.verify.mockReturnValue({
        sub: mockUserId.toString(),
        type: "refresh"
      })
      refreshTokenModel.find.mockResolvedValue([storedToken])
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)
      ;(bcrypt.hash as jest.Mock).mockResolvedValue("newHashedToken")
      userModel.findById.mockResolvedValue(mockUser)
      refreshTokenModel.deleteOne.mockResolvedValue({})
      refreshTokenModel.create.mockResolvedValue({})

      const result = await service.refreshTokens("valid-refresh-token")

      expect(result.accessToken).toBe("mock-token")
      expect(result.refreshToken).toBe("mock-token")
    })

    it("should throw if refresh token JWT is invalid", async () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error("invalid token")
      })

      await expect(service.refreshTokens("bad-token")).rejects.toThrow(
        UnauthorizedException
      )
    })

    it("should throw if token type is not refresh", async () => {
      jwtService.verify.mockReturnValue({ sub: "123", type: "access" })

      await expect(service.refreshTokens("access-token")).rejects.toThrow(
        UnauthorizedException
      )
    })

    it("should throw if stored token not found", async () => {
      jwtService.verify.mockReturnValue({
        sub: mockUserId.toString(),
        type: "refresh"
      })
      refreshTokenModel.find.mockResolvedValue([])

      await expect(service.refreshTokens("orphan-token")).rejects.toThrow(
        UnauthorizedException
      )
    })

    it("should throw if user not found after token verification", async () => {
      const storedToken = {
        _id: new Types.ObjectId(),
        userId: mockUserId.toString(),
        token: "hashedToken",
        expiresAt: new Date(Date.now() + 86400000)
      }

      jwtService.verify.mockReturnValue({
        sub: mockUserId.toString(),
        type: "refresh"
      })
      refreshTokenModel.find.mockResolvedValue([storedToken])
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)
      userModel.findById.mockResolvedValue(null)
      refreshTokenModel.deleteOne.mockResolvedValue({})

      await expect(service.refreshTokens("valid-token")).rejects.toThrow(
        UnauthorizedException
      )
    })

    it("should skip expired stored tokens", async () => {
      const expiredToken = {
        _id: new Types.ObjectId(),
        userId: mockUserId.toString(),
        token: "hashedToken",
        expiresAt: new Date(Date.now() - 86400000)
      }

      jwtService.verify.mockReturnValue({
        sub: mockUserId.toString(),
        type: "refresh"
      })
      refreshTokenModel.find.mockResolvedValue([expiredToken])

      await expect(service.refreshTokens("token")).rejects.toThrow(
        UnauthorizedException
      )
    })
  })

  describe("logout", () => {
    it("should invalidate all refresh tokens for user", async () => {
      refreshTokenModel.deleteMany.mockResolvedValue({})

      await service.logout(mockUserId.toString())

      expect(refreshTokenModel.deleteMany).toHaveBeenCalledWith({
        userId: mockUserId.toString()
      })
    })
  })

  describe("validateUser", () => {
    it("should return user by payload sub", async () => {
      userModel.findById.mockResolvedValue(mockUser)

      const result = await service.validateUser({
        sub: mockUserId.toString(),
        email: "test@example.com",
        name: "Test User",
        role: Role.USER
      })

      expect(result).toEqual(mockUser)
      expect(userModel.findById).toHaveBeenCalledWith(mockUserId.toString())
    })

    it("should return null if user not found", async () => {
      userModel.findById.mockResolvedValue(null)

      const result = await service.validateUser({
        sub: "nonexistent",
        email: "x@x.com",
        name: "X",
        role: Role.USER
      })

      expect(result).toBeNull()
    })
  })
})
