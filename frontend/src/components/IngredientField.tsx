import type { Control, UseFormRegister, FieldErrors } from "react-hook-form"
import type { RecipeFormData } from "../schemas/recipe.schema"
import { INGREDIENT_UNITS } from "../constants/ingredientUnits"

type IngredientFieldProps = {
  index: number
  control: Control<RecipeFormData>
  register: UseFormRegister<RecipeFormData>
  errors: FieldErrors<RecipeFormData>
  onDelete: () => void
}

export default function IngredientField({
  index,
  register,
  errors,
  onDelete
}: IngredientFieldProps) {
  const fieldErrors = errors.ingredients?.[index]

  return (
    <div className="grid grid-cols-12 gap-2 items-start">
      <div className="col-span-5">
        <input
          {...register(`ingredients.${index}.name`)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          type="text"
          placeholder="Ex: Farine"
        />
        {fieldErrors?.name && (
          <p className="text-red-500 text-xs mt-1">
            {fieldErrors.name.message}
          </p>
        )}
      </div>

      <div className="col-span-2">
        <input
          {...register(`ingredients.${index}.quantity`, {
            valueAsNumber: true
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          type="number"
          step="0.1"
          min="0"
          placeholder="250"
        />
        {fieldErrors?.quantity && (
          <p className="text-red-500 text-xs mt-1">
            {fieldErrors.quantity.message}
          </p>
        )}
      </div>

      <div className="col-span-3">
        <select
          {...register(`ingredients.${index}.unit`)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          aria-label="Unité de l'ingrédient"
        >
          {INGREDIENT_UNITS.map((unit) => (
            <option key={unit.value} value={unit.value}>
              {unit.label}
            </option>
          ))}
        </select>
        {fieldErrors?.unit && (
          <p className="text-red-500 text-xs mt-1">
            {fieldErrors.unit.message}
          </p>
        )}
      </div>

      <div className="col-span-2">
        <button
          type="button"
          onClick={onDelete}
          className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors w-full"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
