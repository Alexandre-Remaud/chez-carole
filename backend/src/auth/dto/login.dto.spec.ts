import { validate } from "class-validator"
import { plainToInstance } from "class-transformer"
import { LoginDto } from "./login.dto"

describe("LoginDto", () => {
  function createDto(data: Partial<LoginDto>): LoginDto {
    return plainToInstance(LoginDto, data)
  }

  it("should pass with valid data", async () => {
    const dto = createDto({
      email: "test@example.com",
      password: "Password1"
    })
    const errors = await validate(dto)
    expect(errors).toHaveLength(0)
  })

  it("should fail with invalid email", async () => {
    const dto = createDto({
      email: "invalid",
      password: "Password1"
    })
    const errors = await validate(dto)
    expect(errors.length).toBeGreaterThan(0)
    expect(errors[0].property).toBe("email")
  })

  it("should fail with empty password", async () => {
    const dto = createDto({
      email: "test@example.com",
      password: ""
    })
    const errors = await validate(dto)
    expect(errors.length).toBeGreaterThan(0)
  })

  it("should fail with missing email", async () => {
    const dto = createDto({
      password: "Password1"
    })
    const errors = await validate(dto)
    expect(errors.length).toBeGreaterThan(0)
  })

  it("should fail with missing password", async () => {
    const dto = createDto({
      email: "test@example.com"
    })
    const errors = await validate(dto)
    expect(errors.length).toBeGreaterThan(0)
  })
})
