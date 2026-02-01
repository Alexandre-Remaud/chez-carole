import type { Step } from "@/types/step"

export const createStep = (): Step => ({
  id: crypto.randomUUID(),
  content: "",
  durationUnit: "min",
  temperatureUnit: "C"
})
