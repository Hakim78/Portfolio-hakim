'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { categories, categoryLabels, type Category, type Project } from '@/data/projects'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { TechLogo } from '@/components/ui/TechLogo'
import { cn, pad2 } from '@/lib/utils'

/**
 * Grille filtrable de tous les projets (héritée de l'ancien site, restylée) :
 * cover, catégorie, titre, année, logos de la stack. Clic → fiche /projects/slug.
 */
export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Category | 'all'>('all')
  const list = filter === 'all' ? projects : projects.filter((p) => p.category === filter)

  return (
    <div id="grille" className="gutter scroll-mt-[var(--header-h)] py-[14vh] md:py-[18vh]">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <SectionLabel>Tous les projets</SectionLabel>
          <h2 className="title-xl mt-6">Index</h2>
        </div>
        <p className="label pb-2 text-fg/50">
          {list.length} / {projects.length} projets
        </p>
      </div>

      <div role="group" aria-label="Filtrer par domaine" className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-b border-line pb-4">
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setFilter(c.id)}
            aria-pressed={filter === c.id}
            className={cn(
              'label link-line py-2 transition-colors duration-300',
              filter === c.id ? 'text-fg after:scale-x-100' : 'text-fg/50 hover:text-fg'
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <ul key={filter} className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p, i) => {
          const src = p.cover ?? p.image
          return (
            <li key={p.slug} className="grid-enter" style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}>
              <Link href={`/projects/${p.slug}`} className="group block">
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-line bg-elev">
                  {src ? (
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-main group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center gap-6 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.14),transparent_70%)]">
                      {p.stack.slice(0, 3).map((s) => (
                        <TechLogo key={s} name={s} size={40} />
                      ))}
                      <span className="absolute bottom-3 right-3 font-mono text-xs text-fg/30">{pad2(i + 1)}</span>
                    </div>
                  )}
                  <span className="label absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1.5 text-fg/80 backdrop-blur">
                    {categoryLabels[p.category]}
                  </span>
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-xl tracking-tight transition-colors duration-300 group-hover:text-emerald-400">
                    {p.title}
                  </h3>
                  <span className="font-mono text-xs text-fg/50">{p.year}</span>
                </div>
                <p className="mt-1 text-sm text-fg/60">{p.tagline}</p>
                <ul className="mt-3 flex items-center gap-2.5" aria-label="Stack">
                  {p.stack.slice(0, 6).map((s) => (
                    <li key={s} title={s}>
                      <TechLogo name={s} size={16} />
                    </li>
                  ))}
                </ul>
              </Link>
            </li>
          )
        })}
      </ul>

      {list.length === 0 && <p className="py-16 text-fg/50">Aucun projet dans ce domaine pour le moment.</p>}
    </div>
  )
}
