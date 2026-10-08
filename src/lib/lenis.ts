import type Lenis from 'lenis'

// Instance unique partagée (créée dans app/providers.tsx).
let instance: Lenis | null = null

export function setLenis(lenis: Lenis | null) {
  instance = lenis
}

export function getLenis() {
  return instance
}
