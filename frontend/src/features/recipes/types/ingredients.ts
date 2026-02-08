import type { INGREDIENT_UNITS } from "@recipes/constants/ingredientUnits"

export type IngredientUnit = (typeof INGREDIENT_UNITS)[number]["value"]

export type Ingredient = {
  id: string
  quantity: number
  unit: IngredientUnit
  name: string
}

export type IngredientFieldProps = {
  ingredient: Ingredient
  setIngredient: (updated: Ingredient) => void
  onDelete: (id: string) => void
}
