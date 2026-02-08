import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { recipeFormSchema, type RecipeFormData } from "@recipes/schema"
import { createIngredient } from "@recipes/factories/ingredient.factory"
import { createStep } from "@recipes/factories/step.factory"
import { recipeService } from "@recipes/api"

export function useRecipeForm() {
  const form = useForm<RecipeFormData>({
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

  const ingredients = useFieldArray({
    control: form.control,
    name: "ingredients"
  })

  const steps = useFieldArray({
    control: form.control,
    name: "steps"
  })

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await recipeService.createRecipe(data)
      alert("Recette créée avec succès !")
    } catch (error) {
      console.error("Erreur :", error)
      alert(error instanceof Error ? error.message : "Erreur inconnue")
    }
  })

  return {
    form,
    ingredients,
    steps,
    onSubmit,
    addIngredient: () => ingredients.append(createIngredient()),
    addStep: () => steps.append(createStep(steps.fields.length + 1))
  }
}
