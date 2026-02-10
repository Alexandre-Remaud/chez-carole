import { describe, it, expect } from "vitest"
import { recipeFormSchema } from "./schema"

const validIngredient = {
  id: "ing-1",
  name: "Pommes",
  quantity: 4,
  unit: "pièces"
}

const validStep = {
  id: "step-1",
  order: 1,
  instruction: "Éplucher les pommes"
}

const validRecipe = {
  title: "Tarte aux pommes",
  description: "Une tarte classique",
  category: "dessert" as const,
  servings: 4,
  prepTime: 30,
  difficulty: "easy" as const,
  ingredients: [validIngredient],
  steps: [validStep]
}

describe("recipeFormSchema", () => {
  it("should validate a complete valid recipe", () => {
    const result = recipeFormSchema.safeParse(validRecipe)
    expect(result.success).toBe(true)
  })

  it("should reject an empty title", () => {
    const result = recipeFormSchema.safeParse({
      ...validRecipe,
      title: ""
    })
    expect(result.success).toBe(false)
  })

  it("should reject an empty description", () => {
    const result = recipeFormSchema.safeParse({
      ...validRecipe,
      description: ""
    })
    expect(result.success).toBe(false)
  })

  it("should reject servings less than 1", () => {
    const result = recipeFormSchema.safeParse({
      ...validRecipe,
      servings: 0
    })
    expect(result.success).toBe(false)
  })

  it("should reject servings greater than 100", () => {
    const result = recipeFormSchema.safeParse({
      ...validRecipe,
      servings: 101
    })
    expect(result.success).toBe(false)
  })

  it("should reject an invalid category", () => {
    const result = recipeFormSchema.safeParse({
      ...validRecipe,
      category: "invalid_category"
    })
    expect(result.success).toBe(false)
  })

  it("should reject an invalid difficulty", () => {
    const result = recipeFormSchema.safeParse({
      ...validRecipe,
      difficulty: "impossible"
    })
    expect(result.success).toBe(false)
  })

  it("should reject an empty ingredients array", () => {
    const result = recipeFormSchema.safeParse({
      ...validRecipe,
      ingredients: []
    })
    expect(result.success).toBe(false)
  })

  it("should reject an empty steps array", () => {
    const result = recipeFormSchema.safeParse({
      ...validRecipe,
      steps: []
    })
    expect(result.success).toBe(false)
  })
})
