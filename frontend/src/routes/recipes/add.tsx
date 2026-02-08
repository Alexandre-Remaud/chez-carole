import { createFileRoute } from "@tanstack/react-router"
import Form from "@recipes/Form"

export const Route = createFileRoute("/recipes/add")({
  component: Form
})
