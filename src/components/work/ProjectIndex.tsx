'use client'

import { useState } from 'react'
import Link from 'next/link'
import { categories, categoryLabels, type Category, type Project } from '@/data/projects'
import { cn, pad2 } from '@/lib/utils'

/** Liste complète, filtrable par domaine. */
export function ProjectIndex({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Category | 'all'>('all')
  const list = filter === 'all' ? projects : projects.filter((p) => p.category === filter)

  return (
    <div className="enter" style={{ animationDelay: '120ms' }}>
      <div role="group" aria-label="Filtrer par domaine" className="mt-12 flex flex-wrap gap-x-6 gap-y-3">
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

      <ol className="mt-10 border-t border-line">
        {list.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/projects/${p.slug}`}
              className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 border-b border-line py-5 md:grid-cols-[3rem_1fr_11rem_4rem_2rem] md:gap-x-6 md:py-6"
            >
              <span className="font-mono text-xs text-fg/40">{pad2(projects.indexOf(p) + 1)}</span>
              <span className="min-w-0">
                <span className="block font-display text-xl tracking-tight transition-colors duration-300 group-hover:text-fg md:text-2xl">
                  {p.title}
                </span>
                <span className="mt-1 block truncate text-sm text-fg/50">{p.tagline}</span>
              </span>
              <span className="label hidden text-fg/50 md:block">{categoryLabels[p.category]}</span>
              <span className="font-mono text-xs text-fg/50">{p.year}</span>
              <span
                aria-hidden
                className="hidden justify-self-end text-fg/40 transition-transform duration-500 ease-main group-hover:translate-x-1 group-hover:text-fg md:block"
              >
                →
              </span>
            </Link>
          </li>
        ))}
      </ol>

      {list.length === 0 && <p className="py-16 text-fg/50">Aucun projet dans ce domaine pour le moment.</p>}
    </div>
  )
}
