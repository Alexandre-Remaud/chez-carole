import type { RecipeFormData } from "@recipes/schema"
import toCreateRecipePayload from "@recipes/mapper"
import { apiFetch } from "@/lib/api-client"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

export const recipeService = {
  async createRecipe(data: RecipeFormData) {
    const payload = toCreateRecipePayload(data)

    return apiFetch(`${API_URL}/recipes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
  }
}
