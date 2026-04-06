import { createFileRoute } from "@tanstack/react-router"
import { PublicProfile } from "@/features/profile"

export const Route = createFileRoute("/users/$id")({
  component: PublicProfile
})
