import { createFileRoute, redirect } from "@tanstack/react-router"
import ShoppingLists from "@/pages/ShoppingLists"

export const Route = createFileRoute("/shopping-lists/")({
  beforeLoad: ({ context }) => {
    if (!(context as { user?: unknown }).user) {
      throw redirect({ to: "/login" })
    }
  },
  component: ShoppingLists
})
