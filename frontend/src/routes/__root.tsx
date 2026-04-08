import { lazy } from "react"
import Layout from "@/components/Layout"
import ErrorBoundary from "@/components/ErrorBoundary"
import { Toaster } from "react-hot-toast"
import { createRootRoute } from "@tanstack/react-router"
import { AuthProvider } from "@/features/auth"

const TanStackRouterDevtools = import.meta.env.DEV
  ? lazy(() =>
      import("@tanstack/react-router-devtools").then((mod) => ({
        default: mod.TanStackRouterDevtools
      }))
    )
  : () => null

function RootComponent() {
  return (
    <ErrorBoundary>
      <AuthProvider>
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
        <TanStackRouterDevtools />
      </AuthProvider>
    </ErrorBoundary>
  )
}

export const Route = createRootRoute({ component: RootComponent })
