import IngredientField from "./IngredientField"
import { useState } from "react"
import type { Ingredient } from "../types/ingredients"
import { createIngredient } from "../factories/ingredient.factory"
import StepField from "./StepField"
import type { Step } from "../types/step"
import { createStep } from "../factories/step.factory"

export default function RecipeForm() {
  const [recipeName, setRecipeName] = useState("")
  const [recipeDescription, setRecipeDescription] = useState("")

  const [ingredients, setIngredients] = useState<Ingredient[]>([
    createIngredient()
  ])
  const removeIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((i) => i.id !== id))
  }
  const updateIngredient = (updated: Ingredient) => {
    setIngredients((prev) =>
      prev.map((i) => (i.id === updated.id ? updated : i))
    )
  }
  const addIngredient = () => {
    setIngredients((prev) => [...prev, createIngredient()])
  }

  const [steps, setSteps] = useState<Step[]>([createStep()])
  const removeStep = (id: string) => {
    setSteps((prev) => prev.filter((s) => s.id !== id))
  }
  const updateStep = (updated: Step) => {
    setSteps((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
  }
  const addStep = () => {
    setSteps((prev) => [...prev, createStep()])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({
      name: recipeName,
      description: recipeDescription,
      ingredients,
      steps
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Créer une recette
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
            Informations générales
          </h2>

          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="name"
            >
              Nom de la recette
            </label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              type="text"
              id="name"
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
              placeholder="Ex: Tarte aux pommes"
              aria-label="Nom de la recette"
              aria-describedby="name-description"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              id="description"
              rows={3}
              value={recipeDescription}
              onChange={(e) => setRecipeDescription(e.target.value)}
              placeholder="Décrivez brièvement votre recette..."
              aria-label="Description de la recette"
              aria-describedby="description-description"
            ></textarea>
          </div>
        </section>
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
              Ingrédients
            </h2>
            <button
              type="button"
              onClick={addIngredient}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
              aria-label="Ajouter un ingrédient à la liste"
            >
              <span className="text-lg" aria-hidden="true">
                +
              </span>
              Ajouter un ingrédient
            </button>
          </div>

          <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-600 pb-2 border-b">
            <span className="col-span-5">Ingrédient</span>
            <span className="col-span-2">Quantité</span>
            <span className="col-span-3">Unité</span>
            <span className="col-span-2">Actions</span>
          </div>

          <div className="space-y-2">
            {ingredients.map((ingredient) => (
              <IngredientField
                key={ingredient.id}
                ingredient={ingredient}
                setIngredient={updateIngredient}
                onDelete={removeIngredient}
              />
            ))}
          </div>
        </section>
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
              Étapes de préparation
            </h2>
            <button
              type="button"
              onClick={addStep}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              aria-label="Ajouter une étape à la recette"
            >
              <span className="text-lg" aria-hidden="true">
                +
              </span>
              Ajouter une étape
            </button>
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.id} className="relative">
                <div className="absolute left-0 top-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div className="ml-12">
                  <StepField
                    step={step}
                    setStep={updateStep}
                    onDelete={removeStep}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="pt-6 border-t">
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            aria-label="Enregistrer la recette"
            disabled={
              !recipeName.trim() ||
              ingredients.length === 0 ||
              steps.length === 0
            }
          >
            Enregistrer la recette
          </button>
        </div>
      </form>
    </div>
  )
}
