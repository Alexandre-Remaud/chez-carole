import { createFileRoute } from "@tanstack/react-router"
import RecipeDetail from "@recipes/RecipeDetail"

export const Route = createFileRoute("/recipes/$id")({
  component: RecipeDetail
})
