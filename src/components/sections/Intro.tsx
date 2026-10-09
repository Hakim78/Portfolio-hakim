'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Reveal } from '@/components/ui/Reveal'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { intro, introDetail } from '@/data/profile'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

const Brain = dynamic(() => import('@/components/three/Brain').then((m) => m.Brain), { ssr: false })

/** Mots mis en couleur dans la phrase géante */
const ACCENT = new Set(['AI', 'Engineer.'])

/**
 * Présentation géante façon Alejandro : chaque mot arrive en scrub
 * (grossit, se nettoie du flou, monte) pendant le défilement.
 * Le cerveau hologramme 3D tourne à droite sur desktop.
 */
export function Intro() {
  const ref = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const words = el.querySelectorAll<HTMLElement>('.intro-word')
    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 28%', scrub: true },
    })
    tl.fromTo(
      words,
      { yPercent: 55, scale: 0.72, opacity: 0.06, filter: 'blur(14px)', transformOrigin: '0% 100%' },
      { yPercent: 0, scale: 1, opacity: 1, filter: 'blur(0px)', stagger: 0.05, ease: 'none' }
    )
    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [])

  const words = intro.split(' ')

  return (
    <section id="intro" className="gutter relative scroll-mt-[var(--header-h)] py-[18vh] md:py-[22vh]">
      <div className="grid grid-cols-12 items-center gap-x-6 gap-y-14">
        <div className="col-span-12 lg:col-span-8">
          <SectionLabel>Présentation</SectionLabel>
          <h2 ref={ref} className="title-xl mt-8 max-w-[20ch]" aria-label={intro}>
            {words.map((w, i) => (
              <span key={i}>
                <span
                  aria-hidden
                  className={cn('intro-word inline-block will-change-transform', ACCENT.has(w) && 'text-emerald-400')}
                >
                  {w}
                </span>{' '}
              </span>
            ))}
          </h2>
          <Reveal as="p" className="mt-10 max-w-measure text-base leading-relaxed text-fg/60 md:text-lg" text={introDetail} />
        </div>
        <div className="col-span-12 hidden lg:col-span-4 lg:block">
          <div className="relative aspect-square w-full">
            <div className="absolute inset-[10%] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.22),transparent_65%)] blur-3xl" />
            <Brain className="absolute inset-0" />
          </div>
        </div>
      </div>
    </section>
  )
}
