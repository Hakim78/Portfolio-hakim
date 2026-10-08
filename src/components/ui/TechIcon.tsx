import type { SimpleIcon } from 'simple-icons'

/** Logo monochrome (currentColor) à partir d'une icône simple-icons. */
export function TechIcon({ icon, size = 20, className }: { icon: SimpleIcon; size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden className={className}>
      <path d={icon.path} />
    </svg>
  )
}
