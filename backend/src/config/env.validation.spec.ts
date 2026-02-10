import { validate } from "./env.validation"

describe("env.validation", () => {
  it("should validate a complete config", () => {
    const config = {
      MONGO_URI: "mongodb://localhost:27017/test",
      PORT: "5000",
      FRONTEND_URL: "http://localhost:5173"
    }

    const result = validate(config)

    expect(result.MONGO_URI).toBe("mongodb://localhost:27017/test")
    expect(result.PORT).toBe(5000)
    expect(result.FRONTEND_URL).toBe("http://localhost:5173")
  })

  it("should use default PORT 3000 when not provided", () => {
    const config = {
      MONGO_URI: "mongodb://localhost:27017/test"
    }

    const result = validate(config)

    expect(result.PORT).toBe(3000)
  })

  it("should throw if MONGO_URI is missing", () => {
    expect(() => validate({})).toThrow("Environment validation failed")
  })

  it("should throw if MONGO_URI is empty", () => {
    expect(() => validate({ MONGO_URI: "" })).toThrow(
      "Environment validation failed"
    )
  })

  it("should throw if PORT is not a valid number", () => {
    expect(() =>
      validate({ MONGO_URI: "mongodb://localhost/test", PORT: "abc" })
    ).toThrow("Environment validation failed")
  })

  it("should throw if PORT is out of range", () => {
    expect(() =>
      validate({ MONGO_URI: "mongodb://localhost/test", PORT: "99999" })
    ).toThrow("Environment validation failed")
  })

  it("should throw if FRONTEND_URL is not a valid URL", () => {
    expect(() =>
      validate({
        MONGO_URI: "mongodb://localhost/test",
        FRONTEND_URL: "not-a-url"
      })
    ).toThrow("Environment validation failed")
  })
})
