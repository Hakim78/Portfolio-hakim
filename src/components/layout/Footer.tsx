'use client'

import { useEffect, useRef } from 'react'
import { site } from '@/data/site'
import { RollText } from '@/components/ui/RollText'

const links = [
  { label: 'GitHub', href: site.links.github },
  { label: 'Hugging Face', href: site.links.huggingface },
  { label: 'LinkedIn', href: site.links.linkedin },
]

/**
 * Footer « révélé » : fixé sous la page, il apparaît quand la dernière
 * section remonte (la page garde une marge basse égale à sa hauteur,
 * via la variable --footer-h posée ici).
 */
export function Footer() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const root = document.documentElement
    const update = () => root.style.setProperty('--footer-h', `${el.offsetHeight}px`)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => {
      ro.disconnect()
      root.style.removeProperty('--footer-h')
    }
  }, [])

  return (
    <footer ref={ref} className="fixed inset-x-0 bottom-0 z-0 bg-bg">
      <div className="gutter pb-8 pt-16 md:pt-24">
        <p className="label text-fg/50">Contact direct</p>
        <a href={`mailto:${site.email}`} className="title-xl mt-5 block w-fit transition-colors duration-300 hover:text-fg/70">
          {site.email}
        </a>

        <div className="label mt-14 grid gap-6 border-t border-line pt-6 text-fg/50 md:grid-cols-3 md:items-center">
          <p>
            © {new Date().getFullYear()} {site.name}
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-3 md:justify-center">
            {links.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="transition-colors duration-300 hover:text-fg">
                  <RollText>{l.label}</RollText>
                </a>
              </li>
            ))}
          </ul>
          <p className="md:text-right">
            {site.location} · {site.availability}
          </p>
        </div>
      </div>
    </footer>
  )
}
