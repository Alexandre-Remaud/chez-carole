import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { recipeFormSchema, type RecipeFormData } from "../schemas/recipe.schema"

import IngredientField from "./IngredientField"
import StepField from "./StepField"
import { createIngredient } from "@/factories/ingredient.factory"
import { createStep } from "@/factories/step.factory"
import { CATEGORIES } from "@/constants/categories"
import { recipeService } from "@/services/recipe.service"

export default function RecipeForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RecipeFormData>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "main_course",
      servings: 1,
      prepTime: 0,
      difficulty: "easy",
      ingredients: [createIngredient()],
      steps: [createStep(1)]
    }
  })

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient
  } = useFieldArray({
    control,
    name: "ingredients"
  })

  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep
  } = useFieldArray({
    control,
    name: "steps"
  })

  const onSubmit = async (data: RecipeFormData) => {
    console.log("Données validées :", data)

    try {
      const recipe = await recipeService.createRecipe(data)
      console.log("Recette créée :", recipe)

      alert("Recette créée avec succès !")
    } catch (error) {
      console.error("Erreur :", error)
      alert(error instanceof Error ? error.message : "Erreur inconnue")
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Créer une recette
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
            Informations générales
          </h2>

          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="title"
            >
              Nom de la recette
            </label>
            <input
              {...register("title")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              type="text"
              id="title"
              placeholder="Ex: Tarte aux pommes"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              {...register("description")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              id="description"
              rows={3}
              placeholder="Décrivez brièvement votre recette..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="servings"
              >
                Nombre de personnes
              </label>
              <input
                {...register("servings", { valueAsNumber: true })}
                id="servings"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                type="number"
                min="1"
              />
              {errors.servings && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.servings.message}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="prepTime"
              >
                Temps de préparation (min)
              </label>
              <input
                {...register("prepTime", { valueAsNumber: true })}
                id="prepTime"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                type="number"
                min="0"
              />
              {errors.prepTime && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.prepTime.message}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="difficulty"
              >
                Difficulté
              </label>
              <select
                {...register("difficulty")}
                id="difficulty"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="easy">Facile</option>
                <option value="medium">Moyen</option>
                <option value="hard">Difficile</option>
              </select>
              {errors.difficulty && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.difficulty.message}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="category"
              >
                Catégorie
              </label>
              <select
                {...register("category")}
                id="category"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                {CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
              Ingrédients
            </h2>
            <button
              type="button"
              onClick={() => appendIngredient(createIngredient())}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <span className="text-lg">+</span>
              Ajouter un ingrédient
            </button>
          </div>

          {errors.ingredients && (
            <p className="text-red-500 text-sm">{errors.ingredients.message}</p>
          )}

          <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-600 pb-2 border-b">
            <span className="col-span-5">Ingrédient</span>
            <span className="col-span-2">Quantité</span>
            <span className="col-span-3">Unité</span>
            <span className="col-span-2">Actions</span>
          </div>

          <div className="space-y-2">
            {ingredientFields.map((field, index) => (
              <IngredientField
                key={field.id}
                index={index}
                control={control}
                register={register}
                errors={errors}
                onDelete={() => removeIngredient(index)}
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
              onClick={() => appendStep(createStep(stepFields.length + 1))}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <span className="text-lg">+</span>
              Ajouter une étape
            </button>
          </div>

          {errors.steps && (
            <p className="text-red-500 text-sm">{errors.steps.message}</p>
          )}

          <div className="space-y-4">
            {stepFields.map((field, index) => (
              <div key={field.id} className="relative">
                <div className="absolute left-0 top-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div className="ml-12">
                  <StepField
                    index={index}
                    control={control}
                    register={register}
                    errors={errors}
                    onDelete={() => removeStep(index)}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="pt-6 border-t">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Création en cours..." : "Enregistrer la recette"}
          </button>
        </div>
      </form>
    </div>
  )
}
