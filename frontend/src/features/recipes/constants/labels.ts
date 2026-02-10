import { CATEGORIES } from "@recipes/constants/categories"
import { INGREDIENT_UNITS } from "@recipes/constants/ingredientUnits"

export const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "Facile",
  medium: "Moyen",
  hard: "Difficile"
}

export function getCategoryLabel(value?: string) {
  if (!value) return null
  return CATEGORIES.find((c) => c.value === value)?.label ?? value
}

export function getUnitLabel(value: string) {
  return INGREDIENT_UNITS.find((u) => u.value === value)?.label ?? value
}
