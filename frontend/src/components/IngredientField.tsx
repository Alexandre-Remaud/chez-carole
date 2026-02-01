import type { IngredientUnit, IngredientFieldProps } from "@/types/ingredients"
import { INGREDIENT_UNITS } from "@/constants/ingredientUnits"

export default function IngredientField({
  ingredient,
  setIngredient,
  onDelete
}: IngredientFieldProps) {
  return (
    <div className="grid grid-cols-12 gap-2 items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <input
        className="col-span-5 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        type="text"
        value={ingredient.ingredient}
        onChange={(e) =>
          setIngredient({ ...ingredient, ingredient: e.target.value })
        }
        placeholder="Nom de l'ingrédient"
        aria-label="Nom de l'ingrédient"
      />

      <input
        className="col-span-2 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        type="number"
        value={ingredient.quantity}
        onChange={(e) =>
          setIngredient({ ...ingredient, quantity: Number(e.target.value) })
        }
        min={0}
        step="0.1"
        placeholder="Qté"
        aria-label="Quantité de l'ingrédient"
      />

      <select
        className="col-span-3 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
        value={ingredient.unit}
        onChange={(e) =>
          setIngredient({
            ...ingredient,
            unit: e.target.value as IngredientUnit
          })
        }
        aria-label="Unité de mesure"
      >
        {INGREDIENT_UNITS.map((u) => (
          <option key={u.value} value={u.value}>
            {u.label}
          </option>
        ))}
      </select>

      <button
        onClick={() => onDelete(ingredient.id)}
        className="col-span-2 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center justify-center gap-1"
        aria-label="Supprimer cet ingrédient"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        Supprimer
      </button>
    </div>
  )
}
