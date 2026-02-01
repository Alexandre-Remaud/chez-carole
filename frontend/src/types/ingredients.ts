import type { INGREDIENT_UNITS } from "@/constants/ingredientUnits"

export type IngredientUnit = (typeof INGREDIENT_UNITS)[number]["value"]

export type Ingredient = {
  id: string
  quantity: number
  unit: IngredientUnit
  ingredient: string
}

export type IngredientFieldProps = {
  ingredient: Ingredient
  setIngredient: (updated: Ingredient) => void
  onDelete: (id: string) => void
}
