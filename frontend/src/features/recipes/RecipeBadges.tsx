import { DIFFICULTY_LABELS, getCategoryLabel } from "@recipes/constants/labels"
import type { Recipe } from "@recipes/contract"

type Props = {
  recipe: Pick<Recipe, "category" | "difficulty" | "servings" | "cookTime">
  className?: string
}

export default function RecipeBadges({ recipe, className = "" }: Props) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {recipe.category && (
        <span className="text-xs px-2.5 py-1 bg-warm-50 text-warm-700 rounded-full">
          {getCategoryLabel(recipe.category)}
        </span>
      )}
      {recipe.difficulty && (
        <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">
          {DIFFICULTY_LABELS[recipe.difficulty] ?? recipe.difficulty}
        </span>
      )}
      {recipe.servings && (
        <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">
          {recipe.servings} pers.
        </span>
      )}
      {recipe.cookTime != null && recipe.cookTime > 0 && (
        <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">
          {recipe.cookTime} min
        </span>
      )}
    </div>
  )
}
