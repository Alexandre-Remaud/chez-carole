import { createFileRoute } from "@tanstack/react-router"
import RecipeForm from "@recipes/Form"

export const Route = createFileRoute("/recipes/add")({
  component: RecipeForm
})
