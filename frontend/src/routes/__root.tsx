import Layout from "@/components/Layout"
import ErrorBoundary from "@/components/ErrorBoundary"
import { Toaster } from "react-hot-toast"
import { createRootRoute } from "@tanstack/react-router"

function RootComponent() {
  return (
    <ErrorBoundary>
      <Layout />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: "0.75rem",
            padding: "0.75rem 1rem",
            fontSize: "0.875rem",
            fontWeight: 500
          }
        }}
      />
    </ErrorBoundary>
  )
}

export const Route = createRootRoute({ component: RootComponent })
