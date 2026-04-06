import { createFileRoute } from "@tanstack/react-router"
import { MyProfile } from "@/features/profile"

export const Route = createFileRoute("/profile")({
  component: MyProfile
})
