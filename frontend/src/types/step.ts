export type Step = {
  id: string
  content: string

  duration?: number
  durationUnit: "min" | "sec"

  temperature?: number
  temperatureUnit: "C" | "F"

  note?: string
}

export type StepFieldProps = {
  step: Step
  setStep: (updated: Step) => void
  onDelete: (id: string) => void
}
