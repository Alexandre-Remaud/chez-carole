export class ApiError extends Error {
  readonly status: number
  readonly details?: string[]

  constructor(message: string, status: number, details?: string[]) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.details = details
  }
}

export class NetworkError extends Error {
  constructor(
    message: string = "Impossible de contacter le serveur. Vérifiez votre connexion."
  ) {
    super(message)
    this.name = "NetworkError"
  }
}

const DEFAULT_TIMEOUT = 10_000

function getDefaultErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return "Données invalides. Veuillez vérifier le formulaire."
    case 404:
      return "Ressource introuvable."
    case 409:
      return "Conflit : cette ressource existe déjà."
    case 500:
      return "Erreur interne du serveur. Veuillez réessayer plus tard."
    default:
      return "Une erreur est survenue."
  }
}

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {},
  timeout: number = DEFAULT_TIMEOUT
): Promise<T> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    })

    if (!response.ok) {
      const body = await response.json().catch(() => ({}))

      const message = Array.isArray(body.message)
        ? body.message[0]
        : body.message || getDefaultErrorMessage(response.status)

      const details = Array.isArray(body.message) ? body.message : undefined

      throw new ApiError(message, response.status, details)
    }

    return response.json() as Promise<T>
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new NetworkError("La requête a expiré. Veuillez réessayer.")
    }
    throw new NetworkError()
  } finally {
    clearTimeout(timeoutId)
  }
}
