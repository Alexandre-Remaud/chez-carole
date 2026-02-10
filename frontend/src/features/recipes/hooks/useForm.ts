import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "@tanstack/react-router"
import toast from "react-hot-toast"
import { recipeFormSchema, type RecipeFormData } from "@recipes/schema"
import { createIngredient } from "@recipes/factories/ingredient.factory"
import { createStep } from "@recipes/factories/step.factory"
import { recipeService } from "@recipes/api"
import { ApiError, NetworkError } from "@/lib/api-client"

export function useRecipeForm() {
  const navigate = useNavigate()

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
      toast.success("Recette créée avec succès !")
      form.reset()
      navigate({ to: "/" })
    } catch (error) {
      if (error instanceof NetworkError) {
        toast.error(error.message)
      } else if (error instanceof ApiError) {
        toast.error(error.message)
      } else {
        toast.error("Une erreur inattendue est survenue.")
      }
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
