import type { CATEGORIES } from "@recipes/constants/categories"

export type RecipeCategory = (typeof CATEGORIES)[number]["value"]
