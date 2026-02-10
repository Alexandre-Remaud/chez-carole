import { describe, it, expect } from "vitest"
import { createIngredient } from "./ingredient.factory"

describe("createIngredient", () => {
  it("should create an ingredient with default values", () => {
    const ingredient = createIngredient()

    expect(ingredient.quantity).toBe(1)
    expect(ingredient.unit).toBe("g")
    expect(ingredient.name).toBe("")
    expect(ingredient.id).toBeDefined()
  })

  it("should generate a unique id on each call", () => {
    const a = createIngredient()
    const b = createIngredient()

    expect(a.id).not.toBe(b.id)
  })

  it("should have an empty name", () => {
    const ingredient = createIngredient()
    expect(ingredient.name).toBe("")
  })
})
