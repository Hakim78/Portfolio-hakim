import Image from 'next/image'
import { techLogo } from '@/data/tech'
import { cn } from '@/lib/utils'

/** Logo couleur d'un langage ou d'une marque (PNG de l'ancien site, sinon simple-icons). */
export function TechLogo({ name, size = 20, className }: { name: string; size?: number; className?: string }) {
  const spec = techLogo(name)
  if (!spec) return null
  if (spec.kind === 'img') {
    return (
      <Image
        src={spec.src}
        alt=""
        width={size}
        height={size}
        className={cn('shrink-0 object-contain', className)}
        style={{ width: size, height: size }}
      />
    )
  }
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={spec.color} aria-hidden className={cn('shrink-0', className)}>
      <path d={spec.path} />
    </svg>
  )
}

/** Pastille « logo + nom » utilisée dans les stacks. */
export function TechChip({ name, size = 'sm' }: { name: string; size?: 'sm' | 'md' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-line bg-elev/60 text-fg/85',
        size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm'
      )}
    >
      <TechLogo name={name} size={size === 'sm' ? 14 : 18} />
      {name}
    </span>
  )
}
