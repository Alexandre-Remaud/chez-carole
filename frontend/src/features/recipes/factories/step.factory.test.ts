import { describe, it, expect } from "vitest"
import { createStep } from "./step.factory"

describe("createStep", () => {
  it("should create a step with default values", () => {
    const step = createStep()

    expect(step.order).toBe(1)
    expect(step.instruction).toBe("")
    expect(step.duration).toBeUndefined()
    expect(step.durationUnit).toBeUndefined()
    expect(step.temperature).toBeUndefined()
    expect(step.temperatureUnit).toBeUndefined()
    expect(step.note).toBeUndefined()
    expect(step.id).toBeDefined()
  })

  it("should use the provided order parameter", () => {
    const step = createStep(5)
    expect(step.order).toBe(5)
  })

  it("should generate a unique id on each call", () => {
    const a = createStep()
    const b = createStep()

    expect(a.id).not.toBe(b.id)
  })
})
