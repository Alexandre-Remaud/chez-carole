import type { Ingredient } from "@recipes/types/ingredients"

export const createIngredient = (): Ingredient => ({
  id: crypto.randomUUID(),
  quantity: 1,
  unit: "g",
  name: ""
})
