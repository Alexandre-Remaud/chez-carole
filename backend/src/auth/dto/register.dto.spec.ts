import { validate } from "class-validator"
import { plainToInstance } from "class-transformer"
import { RegisterDto } from "./register.dto"

describe("RegisterDto", () => {
  function createDto(data: Partial<RegisterDto>): RegisterDto {
    return plainToInstance(RegisterDto, data)
  }

  it("should pass with valid data", async () => {
    const dto = createDto({
      email: "test@example.com",
      password: "Password1",
      name: "Jean Dupont"
    })
    const errors = await validate(dto)
    expect(errors).toHaveLength(0)
  })

  it("should fail with invalid email", async () => {
    const dto = createDto({
      email: "not-an-email",
      password: "Password1",
      name: "Jean"
    })
    const errors = await validate(dto)
    expect(errors.length).toBeGreaterThan(0)
    expect(errors[0].property).toBe("email")
  })

  it("should fail with weak password (no uppercase)", async () => {
    const dto = createDto({
      email: "test@example.com",
      password: "password1",
      name: "Jean"
    })
    const errors = await validate(dto)
    expect(errors.length).toBeGreaterThan(0)
    expect(errors[0].property).toBe("password")
  })

  it("should fail with short password", async () => {
    const dto = createDto({
      email: "test@example.com",
      password: "Pa1",
      name: "Jean"
    })
    const errors = await validate(dto)
    expect(errors.length).toBeGreaterThan(0)
  })

  it("should fail with empty name", async () => {
    const dto = createDto({
      email: "test@example.com",
      password: "Password1",
      name: ""
    })
    const errors = await validate(dto)
    expect(errors.length).toBeGreaterThan(0)
  })

  it("should fail with single character name", async () => {
    const dto = createDto({
      email: "test@example.com",
      password: "Password1",
      name: "A"
    })
    const errors = await validate(dto)
    expect(errors.length).toBeGreaterThan(0)
  })

  it("should fail with missing email", async () => {
    const dto = createDto({
      password: "Password1",
      name: "Jean"
    })
    const errors = await validate(dto)
    expect(errors.length).toBeGreaterThan(0)
  })
})
