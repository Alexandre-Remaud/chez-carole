import type { Ingredient } from "@/types/ingredients"

export const createIngredient = (): Ingredient => ({
  id: crypto.randomUUID(),
  quantity: 1,
  unit: "g",
  ingredient: ""
})
