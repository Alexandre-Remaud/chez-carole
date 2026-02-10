import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import ErrorBoundary from "./ErrorBoundary"

// Use a ref object so the throw condition can be changed between renders
const throwRef = { current: false }

function ThrowingChild() {
  if (throwRef.current) {
    throw new Error("Test error")
  }
  return <div>Child content</div>
}

describe("ErrorBoundary", () => {
  it("should render children when there is no error", () => {
    throwRef.current = false

    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>
    )

    expect(screen.getByText("Child content")).toBeInTheDocument()
  })

  it("should show fallback UI when a child throws", () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    throwRef.current = true

    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>
    )

    expect(
      screen.getByText("Quelque chose s'est mal passé")
    ).toBeInTheDocument()
    expect(screen.getByText("Réessayer")).toBeInTheDocument()
    expect(screen.queryByText("Child content")).not.toBeInTheDocument()
  })

  it("should reset error and re-render children when retry is clicked", () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    throwRef.current = true

    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>
    )

    expect(
      screen.getByText("Quelque chose s'est mal passé")
    ).toBeInTheDocument()

    // Stop throwing before clicking retry
    throwRef.current = false
    fireEvent.click(screen.getByText("Réessayer"))

    expect(screen.getByText("Child content")).toBeInTheDocument()
  })
})
