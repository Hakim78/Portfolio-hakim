// Navigation avec l'overlay de transition (enregistrée par app/providers.tsx).
type Navigate = (href: string) => void

let navigate: Navigate | null = null

export function setTransitionNavigate(fn: Navigate | null) {
  navigate = fn
}

/** Navigue avec la transition de page si elle est disponible. */
export function navigateWithTransition(href: string, fallback: Navigate) {
  if (navigate) navigate(href)
  else fallback(href)
}
