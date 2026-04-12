import { createFileRoute, redirect } from "@tanstack/react-router"
import ShoppingListDetail from "@/features/shopping-lists/ShoppingListDetail"

function ShoppingListDetailPage() {
  const { id } = Route.useParams()
  return <ShoppingListDetail listId={id} />
}

export const Route = createFileRoute("/shopping-lists/$id")({
  beforeLoad: ({ context }) => {
    if (!(context as { user?: unknown }).user) {
      throw redirect({ to: "/login" })
    }
  },
  component: ShoppingListDetailPage
})
