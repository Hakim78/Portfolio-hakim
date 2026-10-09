'use client'

import { useState } from 'react'
import Image from 'next/image'
import { experiences, facts } from '@/data/profile'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { TechLogo } from '@/components/ui/TechLogo'
import { cn } from '@/lib/utils'

/**
 * Parcours : liste sobre enrichie (logo, dates exactes, stack en logos couleur).
 * Sur desktop, le mockup de l'expérience survolée s'affiche dans une colonne collante.
 */
export function Experience() {
  const [active, setActive] = useState(0)

  return (
    <section id="parcours" className="gutter scroll-mt-[var(--header-h)] py-[18vh] md:py-[22vh]">
      <div className="grid grid-cols-12 gap-x-6 gap-y-10">
        <div className="col-span-12 pt-2 md:col-span-2">
          <SectionLabel>Parcours</SectionLabel>
        </div>

        <ol className="col-span-12 border-t border-line md:col-span-10 lg:col-span-6">
          {experiences.map((x, i) => (
            <li
              key={x.company}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              tabIndex={0}
              className={cn(
                'grid gap-x-6 gap-y-3 border-b border-line py-7 outline-none transition-colors duration-500 md:grid-cols-[11.5rem_1fr]',
                active === i ? 'text-fg' : 'text-fg/75'
              )}
            >
              <p className="font-mono text-xs text-fg/50 md:pt-2">{x.period}</p>
              <div>
                <div className="flex items-center gap-3">
                  {x.logo && (
                    <Image
                      src={x.logo}
                      alt=""
                      width={112}
                      height={32}
                      className="h-8 w-auto max-w-[7rem] rounded-md object-contain object-left"
                    />
                  )}
                  <p className="font-display text-xl tracking-tight md:text-2xl">{x.company}</p>
                </div>
                <p className="mt-1 text-sm text-fg/60">{x.role}</p>
                <p className="mt-3 max-w-[56ch] text-sm leading-relaxed text-fg/60">{x.detail}</p>
                <ul className="mt-4 flex flex-wrap gap-2" aria-label="Stack">
                  {x.stack.map((s) => (
                    <li
                      key={s}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-elev/60 px-2.5 py-1 text-xs text-fg/85"
                    >
                      <TechLogo name={s} size={14} />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>

        {/* Mockup de l'expérience survolée (desktop) */}
        <div className="hidden lg:col-span-4 lg:block">
          <div className="sticky top-[calc(var(--header-h)+2rem)] aspect-[4/3] overflow-hidden rounded-xl border border-line bg-elev">
            {experiences.map(
              (x, i) =>
                x.mockup && (
                  <Image
                    key={x.company}
                    src={x.mockup}
                    alt=""
                    fill
                    sizes="33vw"
                    className={cn(
                      'object-contain p-6 transition-all duration-700 ease-main',
                      active === i ? 'scale-100 opacity-100' : 'scale-[0.96] opacity-0'
                    )}
                  />
                )
            )}
          </div>
        </div>
      </div>

      {/* Repères */}
      <div className="mt-24 grid grid-cols-12 gap-x-6 gap-y-10 md:mt-32">
        <div className="col-span-12 pt-2 md:col-span-2">
          <SectionLabel>Repères</SectionLabel>
        </div>
        <dl className="col-span-12 grid gap-8 sm:grid-cols-2 md:col-span-10 lg:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label}>
              <dt className="label text-fg/50">{f.label}</dt>
              <dd className="mt-3 text-base">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
