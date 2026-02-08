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
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold text-gray-800">
          Nouvelle recette
        </h2>
        <p className="text-gray-500 mt-1">
          Remplissez les informations ci-dessous pour ajouter votre recette.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        {/* Informations générales */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Informations générales
          </h3>

          <div className="space-y-5">
            <div>
              <label className="label-field" htmlFor="title">
                Nom de la recette
              </label>
              <input
                {...register("title")}
                className="input-field"
                type="text"
                id="title"
                placeholder="Ex : Tarte aux pommes"
              />
              {errors.title && (
                <p className="error-message">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="label-field" htmlFor="description">
                Description
              </label>
              <textarea
                {...register("description")}
                className="input-field resize-none"
                id="description"
                rows={3}
                placeholder="Décrivez brièvement votre recette..."
              />
              {errors.description && (
                <p className="error-message">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="label-field" htmlFor="servings">
                  Personnes
                </label>
                <input
                  {...register("servings", { valueAsNumber: true })}
                  id="servings"
                  className="input-field"
                  type="number"
                  min="1"
                />
                {errors.servings && (
                  <p className="error-message">{errors.servings.message}</p>
                )}
              </div>

              <div>
                <label className="label-field" htmlFor="prepTime">
                  Préparation (min)
                </label>
                <input
                  {...register("prepTime", { valueAsNumber: true })}
                  id="prepTime"
                  className="input-field"
                  type="number"
                  min="0"
                />
                {errors.prepTime && (
                  <p className="error-message">{errors.prepTime.message}</p>
                )}
              </div>

              <div>
                <label className="label-field" htmlFor="difficulty">
                  Difficulté
                </label>
                <select
                  {...register("difficulty")}
                  id="difficulty"
                  className="select-field"
                >
                  <option value="easy">Facile</option>
                  <option value="medium">Moyen</option>
                  <option value="hard">Difficile</option>
                </select>
                {errors.difficulty && (
                  <p className="error-message">{errors.difficulty.message}</p>
                )}
              </div>

              <div>
                <label className="label-field" htmlFor="category">
                  Catégorie
                </label>
                <select
                  {...register("category")}
                  id="category"
                  className="select-field"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="error-message">{errors.category.message}</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Ingrédients */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Ingrédients
          </h3>

          {errors.ingredients && (
            <p className="error-message mb-4">{errors.ingredients.message}</p>
          )}

          <div className="space-y-3">
            {ingredientFields.map((field, index) => (
              <IngredientField
                key={field.id}
                index={index}
                control={control}
                register={register}
                errors={errors}
                onDelete={() => removeIngredient(index)}
                canDelete={ingredientFields.length > 1}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => appendIngredient(createIngredient())}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-warm-700 bg-warm-50 border border-warm-200 rounded-xl hover:bg-warm-100 transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Ajouter un ingrédient
          </button>
        </section>

        {/* Étapes */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Étapes de préparation
          </h3>

          {errors.steps && (
            <p className="error-message mb-4">{errors.steps.message}</p>
          )}

          <div className="space-y-4">
            {stepFields.map((field, index) => (
              <StepField
                key={field.id}
                index={index}
                stepNumber={index + 1}
                control={control}
                register={register}
                errors={errors}
                onDelete={() => removeStep(index)}
                canDelete={stepFields.length > 1}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => appendStep(createStep(stepFields.length + 1))}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-warm-700 bg-warm-50 border border-warm-200 rounded-xl hover:bg-warm-100 transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Ajouter une étape
          </button>
        </section>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-warm-600 text-white rounded-2xl hover:bg-warm-700 active:bg-warm-800 transition-colors font-semibold text-lg shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Enregistrement..." : "Enregistrer la recette"}
        </button>
      </form>
    </div>
  )
}
