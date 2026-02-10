import { useEffect, useState } from "react"
import { Link } from "@tanstack/react-router"
import { recipeService } from "@recipes/api"
import RecipeBadges from "@recipes/RecipeBadges"
import type { Recipe } from "@recipes/contract"

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    recipeService
      .getRecipes()
      .then(setRecipes)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12 text-gray-500">
        Chargement des recettes...
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12 text-red-500">
        {error}
      </div>
    )
  }

  if (recipes.length === 0) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <p className="text-gray-500 mb-4">Aucune recette pour le moment.</p>
        <Link
          to="/recipes/add"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-warm-600 rounded-xl hover:bg-warm-700 transition-colors"
        >
          Ajouter une recette
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-display text-2xl font-bold text-gray-800 mb-6">
        Recettes
      </h1>

      <ul className="grid gap-4">
        {recipes.map((recipe) => (
          <li key={recipe._id}>
            <Link
              to="/recipes/$id"
              params={{ id: recipe._id }}
              className="block bg-white border border-gray-100 rounded-xl p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="font-display text-lg font-semibold text-gray-800 truncate">
                    {recipe.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {recipe.description}
                  </p>
                </div>
              </div>

              <RecipeBadges recipe={recipe} className="mt-3" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
