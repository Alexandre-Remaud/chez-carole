import type { Control, UseFormRegister, FieldErrors } from "react-hook-form"
import type { RecipeFormData } from "@recipes/schema"
import { INGREDIENT_UNITS } from "@recipes/constants/ingredientUnits"

type IngredientFieldProps = {
  index: number
  control: Control<RecipeFormData>
  register: UseFormRegister<RecipeFormData>
  errors: FieldErrors<RecipeFormData>
  onDelete: () => void
  canDelete: boolean
}

export default function IngredientField({
  index,
  register,
  errors,
  onDelete,
  canDelete
}: IngredientFieldProps) {
  const fieldErrors = errors.ingredients?.[index]

  return (
    <div className="flex items-start gap-3 group">
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-[1fr_80px_140px] gap-2">
        <div>
          <input
            {...register(`ingredients.${index}.name`)}
            className="input-field"
            type="text"
            placeholder="Ingrédient (ex : Farine)"
            aria-label={`Nom de l'ingrédient ${index + 1}`}
          />
          {fieldErrors?.name && (
            <p className="error-message">{fieldErrors.name.message}</p>
          )}
        </div>

        <div>
          <input
            {...register(`ingredients.${index}.quantity`, {
              valueAsNumber: true
            })}
            className="input-field"
            type="number"
            step="0.1"
            min="0"
            placeholder="Qté"
            aria-label={`Quantité de l'ingrédient ${index + 1}`}
          />
          {fieldErrors?.quantity && (
            <p className="error-message">{fieldErrors.quantity.message}</p>
          )}
        </div>

        <div>
          <select
            {...register(`ingredients.${index}.unit`)}
            className="select-field"
            aria-label={`Unité de l'ingrédient ${index + 1}`}
          >
            {INGREDIENT_UNITS.map((unit) => (
              <option key={unit.value} value={unit.value}>
                {unit.label}
              </option>
            ))}
          </select>
          {fieldErrors?.unit && (
            <p className="error-message">{fieldErrors.unit.message}</p>
          )}
        </div>
      </div>

      {canDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="mt-1.5 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          aria-label={`Supprimer l'ingrédient ${index + 1}`}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}
