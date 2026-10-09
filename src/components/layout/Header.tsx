'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { nav, site } from '@/data/site'
import { RollText } from '@/components/ui/RollText'
import { cn } from '@/lib/utils'

/** En-tête fixe, signalétique : nom à gauche, trois liens à droite. */
export function Header() {
  const pathname = usePathname()

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="gutter flex h-[var(--header-h)] items-center justify-between">
        <Link href="/" className="label pointer-events-auto flex items-baseline gap-3">
          <RollText>{site.name}</RollText>
          <span className="hidden text-fg/50 sm:inline">{site.role}</span>
        </Link>

        <nav aria-label="Navigation principale" className="pointer-events-auto flex items-center gap-5 sm:gap-8">
          {nav.map((item) => {
            // Sur l'accueil, les ancres restent des ancres (défilement Lenis)
            const href = pathname === '/' && item.href.startsWith('/#') ? item.href.slice(1) : item.href
            const active = item.href === '/#projets' && pathname.startsWith('/projects')
            return (
              <Link
                key={item.href}
                href={href}
                className={cn('label transition-colors duration-300', active ? 'text-fg' : 'text-fg/60 hover:text-fg')}
              >
                <RollText>{item.label}</RollText>
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
