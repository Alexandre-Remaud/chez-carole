import { Reflector } from "@nestjs/core"
import { ExecutionContext } from "@nestjs/common"
import { RolesGuard } from "./roles.guard"
import { Role } from "../role.enum"

describe("RolesGuard", () => {
  let guard: RolesGuard
  let reflector: Reflector

  beforeEach(() => {
    reflector = new Reflector()
    guard = new RolesGuard(reflector)
  })

  function createMockContext(user?: { role: Role }): ExecutionContext {
    return {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ user })
      })
    } as unknown as ExecutionContext
  }

  it("should allow access when no roles are required", () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(undefined)
    const context = createMockContext({ role: Role.USER })

    expect(guard.canActivate(context)).toBe(true)
  })

  it("should allow access when user has required role", () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue([Role.ADMIN])
    const context = createMockContext({ role: Role.ADMIN })

    expect(guard.canActivate(context)).toBe(true)
  })

  it("should deny access when user does not have required role", () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue([Role.ADMIN])
    const context = createMockContext({ role: Role.USER })

    expect(guard.canActivate(context)).toBe(false)
  })

  it("should deny access when user is not present", () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue([Role.USER])
    const context = createMockContext(undefined)

    expect(guard.canActivate(context)).toBe(false)
  })

  it("should allow when user has one of multiple required roles", () => {
    jest
      .spyOn(reflector, "getAllAndOverride")
      .mockReturnValue([Role.ADMIN, Role.USER])
    const context = createMockContext({ role: Role.USER })

    expect(guard.canActivate(context)).toBe(true)
  })
})
