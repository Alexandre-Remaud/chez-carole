import type { Control, UseFormRegister, FieldErrors } from "react-hook-form"
import type { RecipeFormData } from "../schemas/recipe.schema"
import { useWatch } from "react-hook-form"

type StepFieldProps = {
  index: number
  control: Control<RecipeFormData>
  register: UseFormRegister<RecipeFormData>
  errors: FieldErrors<RecipeFormData>
  onDelete: () => void
}

export default function StepField({
  index,
  control,
  register,
  errors,
  onDelete
}: StepFieldProps) {
  const fieldErrors = errors.steps?.[index]

  const duration = useWatch({ control, name: `steps.${index}.duration` })
  const temperature = useWatch({ control, name: `steps.${index}.temperature` })

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Instruction de l'étape
          </label>
          <textarea
            {...register(`steps.${index}.instruction`)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            placeholder="Décrivez cette étape de la recette..."
            rows={3}
            aria-label="Instruction de l'étape"
          />
          {fieldErrors?.instruction && (
            <p className="text-red-500 text-sm mt-1">
              {fieldErrors.instruction.message}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <span className="text-gray-400">⚙️</span>
            Informations optionnelles
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">
                Durée
              </label>
              <div className="flex gap-2">
                <input
                  {...register(`steps.${index}.duration`, {
                    setValueAs: (v) => (v === "" ? undefined : Number(v))
                  })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  type="number"
                  placeholder="Durée"
                  min="0"
                  step="1"
                  aria-label="Durée de l'étape"
                />
                <select
                  {...register(`steps.${index}.durationUnit`)}
                  disabled={!duration || duration === 0}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                  aria-label="Unité de durée"
                >
                  <option value="min">min</option>
                  <option value="sec">sec</option>
                </select>
              </div>
              {fieldErrors?.duration && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.duration.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">
                Température
              </label>
              <div className="flex gap-2">
                <input
                  {...register(`steps.${index}.temperature`, {
                    setValueAs: (v) => (v === "" ? undefined : Number(v))
                  })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  type="number"
                  placeholder="Température"
                  min="0"
                  step="1"
                  aria-label="Température de cuisson"
                />
                <select
                  {...register(`steps.${index}.temperatureUnit`)}
                  disabled={!temperature || temperature === 0}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                  aria-label="Unité de température"
                >
                  <option value="C">°C</option>
                  <option value="F">°F</option>
                </select>
              </div>
              {fieldErrors?.temperature && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.temperature.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Note
          </label>
          <textarea
            {...register(`steps.${index}.note`)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            placeholder="Ajoutez une note ou un conseil..."
            rows={2}
            aria-label="Note optionnelle pour l'étape"
          />
          {fieldErrors?.note && (
            <p className="text-red-500 text-sm mt-1">
              {fieldErrors.note.message}
            </p>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center gap-2 text-sm"
            aria-label="Supprimer cette étape"
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
            Supprimer l'étape
          </button>
        </div>
      </div>
    </div>
  )
}
