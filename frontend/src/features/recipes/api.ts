import type { RecipeFormData } from "@recipes/schema"
import toCreateRecipePayload from "@recipes/mapper"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

export const recipeService = {
  async createRecipe(data: RecipeFormData) {
    const payload = toCreateRecipePayload(data)

    const response = await fetch(`${API_URL}/recipes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(
        error.message || "Erreur lors de la création de la recette"
      )
    }

    return response.json()
  }
}
