import type { CATEGORIES } from "@/constants/categories"

export type RecipeCategory = (typeof CATEGORIES)[number]["value"]
