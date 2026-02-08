import type { Step } from "@/types/step"

export function createStep(order: number = 1): Step {
  return {
    id: crypto.randomUUID(),
    order: order,
    instruction: "",
    duration: undefined,
    durationUnit: undefined,
    temperature: undefined,
    temperatureUnit: undefined,
    note: undefined
  }
}
