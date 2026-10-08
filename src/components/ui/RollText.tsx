import { cn } from '@/lib/utils'

/**
 * Texte « roulant » au survol : le parent (lien, bouton, .group) déclenche
 * la montée du mot, remplacé par son doublon venu du dessous.
 */
export function RollText({ children, className }: { children: string; className?: string }) {
  return (
    <span className={cn('roll', className)}>
      <span className="roll-track">
        <span>{children}</span>
        <span aria-hidden>{children}</span>
      </span>
    </span>
  )
}
