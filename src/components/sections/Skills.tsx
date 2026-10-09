'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { skillCategories } from '@/data/skills'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { TechLogo } from '@/components/ui/TechLogo'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

const N = skillCategories.length

/**
 * Compétences en accordéon épinglé (inspiration Alejandro) : sur desktop la
 * section est épinglée et chaque ligne [01] … [05] s'ouvre à tour de rôle au
 * scroll, en révélant son visuel 3D et ses logos. Sur mobile : liste ouverte.
 */
export function Skills() {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const [pinned, setPinned] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      setPinned(true)
      const st = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${window.innerHeight * N * 0.75}`,
        pin: true,
        pinSpacing: true,
        scrub: true,
        onUpdate: (self) => setActive(Math.min(N - 1, Math.floor(self.progress * N))),
      })
      return () => {
        st.kill()
        setPinned(false)
        setActive(0)
      }
    })
    return () => mm.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="competences"
      className="gutter scroll-mt-[var(--header-h)] py-[14vh] lg:flex lg:min-h-svh lg:flex-col lg:justify-center lg:py-0"
    >
      <div className="grid grid-cols-12 gap-x-6 gap-y-10 lg:items-center">
        <div className="col-span-12 lg:col-span-6">
          <SectionLabel>Compétences</SectionLabel>
          <ol className="mt-8 border-t border-line">
            {skillCategories.map((c, i) => {
              const open = !pinned || active === i
              return (
                <li key={c.n} className="border-b border-line">
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-expanded={open}
                    className={cn(
                      'flex w-full items-baseline gap-4 py-5 text-left transition-colors duration-500 sm:gap-5',
                      open ? 'text-fg' : 'text-fg/40 hover:text-fg/80'
                    )}
                  >
                    <span className="font-mono text-xs">[{c.n}]</span>
                    <span className="font-display text-2xl tracking-tight md:text-3xl lg:text-[2.1rem]">{c.title}</span>
                    <span className="label ml-auto hidden text-fg/50 sm:inline">{c.subtitle}</span>
                  </button>
                  <div className={cn('skill-body', open && 'is-open')} aria-hidden={!open}>
                    <div className="skill-body-inner">
                      <div className="pb-7 sm:pl-[3.4rem]">
                        <div className="relative mb-5 h-24 w-24 lg:hidden">
                          <Image src={c.visual} alt="" fill sizes="96px" className="object-contain" />
                        </div>
                        <p className="max-w-[54ch] text-sm leading-relaxed text-fg/60 md:text-base">{c.description}</p>
                        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
                          {c.techs.map((t) => (
                            <li
                              key={t}
                              className="inline-flex items-center gap-2 rounded-full border border-line bg-elev/60 px-2.5 py-1.5 text-xs text-fg/85"
                            >
                              <TechLogo name={t} size={16} />
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>

        {/* Visuel de la catégorie active (desktop) */}
        <div className="hidden lg:col-span-5 lg:col-start-8 lg:block">
          <div className="relative aspect-square w-full">
            {skillCategories.map((c, i) => (
              <div key={c.n} className={cn('skill-visual absolute inset-0', active === i && 'is-active')}>
                <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.2),transparent_65%)] blur-2xl" />
                <Image src={c.visual} alt="" fill sizes="40vw" className="object-contain p-12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
