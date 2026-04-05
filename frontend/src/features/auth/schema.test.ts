import { describe, it, expect } from "vitest"
import { registerSchema, loginSchema } from "./schema"

describe("registerSchema", () => {
  it("should accept valid registration data", () => {
    const result = registerSchema.safeParse({
      email: "test@example.com",
      password: "Password1",
      name: "Jean Dupont"
    })
    expect(result.success).toBe(true)
  })

  it("should reject invalid email", () => {
    const result = registerSchema.safeParse({
      email: "not-email",
      password: "Password1",
      name: "Jean"
    })
    expect(result.success).toBe(false)
  })

  it("should reject short password", () => {
    const result = registerSchema.safeParse({
      email: "test@example.com",
      password: "short",
      name: "Jean"
    })
    expect(result.success).toBe(false)
  })

  it("should reject empty name", () => {
    const result = registerSchema.safeParse({
      email: "test@example.com",
      password: "Password1",
      name: ""
    })
    expect(result.success).toBe(false)
  })

  it("should reject missing fields", () => {
    const result = registerSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})

describe("loginSchema", () => {
  it("should accept valid login data", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "Password1"
    })
    expect(result.success).toBe(true)
  })

  it("should reject invalid email", () => {
    const result = loginSchema.safeParse({
      email: "bad",
      password: "Password1"
    })
    expect(result.success).toBe(false)
  })

  it("should reject empty password", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: ""
    })
    expect(result.success).toBe(false)
  })

  it("should reject missing fields", () => {
    const result = loginSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})
