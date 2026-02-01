import type { StepFieldProps } from "@/types/step"

export default function StepField({ step, setStep, onDelete }: StepFieldProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Instruction de l'étape
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            placeholder="Décrivez cette étape de la recette..."
            value={step.content}
            onChange={(e) => setStep({ ...step, content: e.target.value })}
            rows={3}
            aria-label="Instruction de l'étape"
            required
          />
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
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  type="number"
                  placeholder="Durée"
                  value={step.duration || ""}
                  onChange={(e) =>
                    setStep({
                      ...step,
                      duration: e.target.value
                        ? Number(e.target.value)
                        : undefined
                    })
                  }
                  min={0}
                  aria-label="Durée de l'étape"
                />
                <select
                  value={step.durationUnit}
                  onChange={(e) =>
                    setStep({
                      ...step,
                      durationUnit: e.target.value as "min" | "sec"
                    })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                  aria-label="Unité de durée"
                >
                  <option value="min">min</option>
                  <option value="sec">sec</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">
                Température
              </label>
              <div className="flex gap-2">
                <input
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  type="number"
                  placeholder="Température"
                  value={step.temperature || ""}
                  onChange={(e) =>
                    setStep({
                      ...step,
                      temperature: e.target.value
                        ? Number(e.target.value)
                        : undefined
                    })
                  }
                  aria-label="Température de cuisson"
                />
                <select
                  value={step.temperatureUnit}
                  onChange={(e) =>
                    setStep({
                      ...step,
                      temperatureUnit: e.target.value as "C" | "F"
                    })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                  aria-label="Unité de température"
                >
                  <option value="C">°C</option>
                  <option value="F">°F</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Note (optionnel)
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            placeholder="Ajoutez une note ou un conseil..."
            value={step.note}
            onChange={(e) => setStep({ ...step, note: e.target.value })}
            rows={2}
            aria-label="Note optionnelle pour l'étape"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => onDelete(step.id)}
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
