import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useShare } from "./useShare"

vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn() }
}))

import toast from "react-hot-toast"

Object.assign(navigator, {
  clipboard: { writeText: vi.fn().mockResolvedValue(undefined) }
})

describe("useShare", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should return canNativeShare=false when navigator.share is undefined", () => {
    const { result } = renderHook(() =>
      useShare("Tarte", "Une tarte classique", "http://localhost/recipes/1")
    )

    expect(result.current.canNativeShare).toBe(false)
  })

  it("should copy to clipboard and show toast when share is called without native share", async () => {
    const { result } = renderHook(() =>
      useShare("Tarte", "Une tarte classique", "http://localhost/recipes/1")
    )

    await act(async () => {
      await result.current.share()
    })

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      "http://localhost/recipes/1"
    )
    expect(toast.success).toHaveBeenCalledWith("Lien copié !")
  })

  it('should show toast "Lien copié !" after clipboard copy', async () => {
    const { result } = renderHook(() =>
      useShare("Tarte", "Description", "http://localhost/recipes/2")
    )

    await act(async () => {
      await result.current.share()
    })

    expect(toast.success).toHaveBeenCalledTimes(1)
    expect(toast.success).toHaveBeenCalledWith("Lien copié !")
  })
})
