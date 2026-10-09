'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getLenis } from '@/lib/lenis'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

const FaultyTerminal = dynamic(() => import('./FaultyTerminal'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-black" />,
})

/**
 * Hero de l'ancien portfolio, reconstruit avec GSAP (sans framer-motion) :
 * fond shader « terminal défaillant » teinté émeraude, lettres HAKIM / PORTFOLIO
 * qui se dispersent au scroll, puis une fenêtre terminal qui se révèle et se tape.
 * La section fait 340vh : le contenu reste collé pendant 240vh de défilement.
 */
const CFG = {
  spreadX: 300,
  spreadY: 350,
  rotation: 30,
  lettersGoneAt: 0.3,
  revealStart: 0.32,
  revealEnd: 0.6,
  maxLetterBlur: 30,
  maxRevealBlur: 10,
  typeSpeed: 24,
}

type Line = { type: 'cmd' | 'out'; text: string; className?: string }

const SCRIPT: Line[] = [
  { type: 'cmd', text: '$ whoami' },
  { type: 'out', text: 'Hakim Djaalal — AI Engineer', className: 'text-white' },
  { type: 'cmd', text: '$ cat skills.txt' },
  { type: 'out', text: '→ Vision & LLM', className: 'text-sky-400' },
  { type: 'out', text: '→ Full-Stack & Mobile', className: 'text-cyan-400' },
  { type: 'out', text: '→ Data Engineering', className: 'text-violet-400' },
  { type: 'cmd', text: '$ echo $STATUS' },
  { type: 'out', text: '✓ Disponible — CDI ou freelance', className: 'font-medium text-emerald-400' },
  { type: 'cmd', text: '$ _' },
]

/** Délais de départ (ms) de chaque ligne, calculés une fois. */
const TIMED = (() => {
  let t = 0
  return SCRIPT.map((line) => {
    const start = t
    t += line.type === 'cmd' ? line.text.length * CFG.typeSpeed + 300 : 350
    return { ...line, start }
  })
})()

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const termRef = useRef<HTMLDivElement>(null)
  const contRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLButtonElement>(null)
  const [show, setShow] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReduced(true)
      setShow(true)
      return
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          onUpdate: (self) => {
            if (self.progress >= CFG.revealStart) setShow(true)
          },
        },
      })

      // Lettres : chacune part dans une direction qui lui est propre
      section.querySelectorAll<HTMLElement>('.hero-letter').forEach((el) => {
        const i = Number(el.dataset.i)
        const n = Number(el.dataset.n)
        const bias = el.dataset.bias === 'up' ? -1 : 1
        const center = (n - 1) / 2
        const norm = center !== 0 ? (i - center) / center : 0
        const rx = Math.sin(i * 2.5) * 0.8 + (Math.random() - 0.5) * 0.4
        const ry = Math.cos(i * 1.7) * 0.5 + Math.random() * 0.5
        const rr = Math.sin(i * 3.2) * 0.6 + (Math.random() - 0.5) * 0.4
        const delay = Math.random() * 0.05
        tl.to(
          el,
          {
            x: norm * CFG.spreadX + rx * CFG.spreadX * 0.7,
            y: CFG.spreadY * bias + ry * CFG.spreadY * 0.5 * bias,
            rotation: (norm + rr) * CFG.rotation,
            scale: 0.3,
            opacity: 0,
            filter: `blur(${CFG.maxLetterBlur}px)`,
            ease: 'power2.in',
            duration: CFG.lettersGoneAt - delay,
          },
          delay
        )
      })

      // Terminal : apparaît net et à sa place
      tl.fromTo(
        termRef.current,
        { opacity: 0, scale: 0.92, y: 30, filter: `blur(${CFG.maxRevealBlur}px)` },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          filter: 'blur(0px)',
          ease: 'power2.out',
          duration: CFG.revealEnd - CFG.revealStart,
        },
        CFG.revealStart
      )
      tl.fromTo(contRef.current, { opacity: 0 }, { opacity: 1, duration: 0.05 }, CFG.revealEnd)
      tl.to(hintRef.current, { opacity: 0, duration: 0.06 }, 0)
      // Temps mort : le terminal reste lisible jusqu'à la fin de la section
      tl.to({}, { duration: 1 - CFG.revealEnd }, CFG.revealEnd)
    }, section)

    return () => ctx.revert()
  }, [])

  const scrollNext = () => {
    const target = document.getElementById('intro')
    const lenis = getLenis()
    if (target && lenis) lenis.scrollTo(target, { duration: 1.6 })
    else target?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section ref={sectionRef} aria-label="Introduction" className={cn('relative', reduced ? 'min-h-svh' : 'h-[340vh]')}>
      <div className="sticky top-0 flex h-svh w-full items-center justify-center overflow-hidden bg-black">
        {/* Fond shader */}
        <div className="absolute inset-0 z-0">
          <FaultyTerminal
            scale={1.5}
            gridMul={[2, 1]}
            digitSize={1.2}
            timeScale={0.5}
            scanlineIntensity={0.5}
            tint="#10b981"
            brightness={0.2}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,black_70%)]" />
        </div>

        {/* Lettres chaotiques */}
        {!reduced && (
          <div className="pointer-events-none relative z-10 flex select-none flex-col items-center justify-center">
            <ChaoticWord text="HAKIM" bias="up" className="text-white" />
            <ChaoticWord text="PORTFOLIO" bias="down" className="-mt-[2vw] text-emerald-400" />
          </div>
        )}

        {/* Terminal */}
        <div
          ref={termRef}
          className={cn(
            'absolute inset-0 z-20 flex items-center justify-center px-4',
            reduced ? 'pointer-events-auto' : 'pointer-events-none'
          )}
          style={reduced ? undefined : { opacity: 0 }}
        >
          <div className="w-full max-w-2xl text-center">
            <div className="pointer-events-auto relative overflow-hidden rounded-xl border border-white/10 bg-zinc-950/80 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-2 border-b border-white/5 bg-zinc-900/50 px-4 py-3">
                <div className="flex gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-500/80" />
                  <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <span className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <span className="ml-2 font-mono text-[10px] text-zinc-500">terminal</span>
              </div>
              <div className="min-h-[18rem] space-y-2 p-4 text-left font-mono text-sm sm:p-6 sm:text-base">
                {show && TIMED.map((line, i) => (line.type === 'cmd' ? <TypedLine key={i} {...line} /> : <OutLine key={i} {...line} />))}
              </div>
            </div>

            <div ref={contRef} className="mt-8 flex flex-col items-center gap-2 text-white/40" style={reduced ? undefined : { opacity: 0 }}>
              <span className="font-mono text-[10px] uppercase tracking-[0.4em]">Continuer</span>
              <svg className="hero-bounce h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>

        {/* Indication de scroll */}
        {!reduced && (
          <button
            ref={hintRef}
            type="button"
            onClick={scrollNext}
            className="absolute bottom-10 left-1/2 z-30 -translate-x-1/2 text-white/30 transition-colors hover:text-white/60"
          >
            {/* L'entrée CSS est sur l'enfant : GSAP garde la main sur l'opacité du bouton */}
            <span className="hero-hint flex flex-col items-center gap-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.5em]">Scroll</span>
              <span className="flex h-10 w-6 items-start justify-center rounded-full border border-current p-2">
                <span className="hero-wheel h-2 w-1 rounded-full bg-current" />
              </span>
            </span>
          </button>
        )}

        <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-32 bg-gradient-to-b from-black to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-32 bg-gradient-to-t from-black to-transparent" />
      </div>
    </section>
  )
}

function ChaoticWord({ text, bias, className }: { text: string; bias: 'up' | 'down'; className?: string }) {
  const letters = text.split('')
  return (
    <div className={cn('overflow-visible leading-[0.85]', className)}>
      <p
        className="flex justify-center whitespace-nowrap font-display text-[18vw] font-bold tracking-tighter sm:text-[15vw] md:text-[14vw]"
        aria-label={text}
      >
        {letters.map((ch, i) => (
          <span
            key={i}
            aria-hidden
            className="hero-letter inline-block will-change-transform"
            data-i={i}
            data-n={letters.length}
            data-bias={bias}
          >
            {ch}
          </span>
        ))}
      </p>
    </div>
  )
}

function TypedLine({ text, start }: Line & { start: number }) {
  const chars = text.split('')
  const end = start + chars.length * CFG.typeSpeed
  return (
    <div className="flex flex-wrap items-center text-emerald-400">
      {chars.map((c, i) => (
        <span key={i} className="hero-char" style={{ animationDelay: `${start + i * CFG.typeSpeed}ms` }}>
          {c === ' ' ? ' ' : c}
        </span>
      ))}
      <span className="hero-cursor -mb-0.5 ml-0.5 inline-block h-4 w-2 bg-current" style={{ animationDelay: `${end}ms` }} />
    </div>
  )
}

function OutLine({ text, start, className }: Line & { start: number }) {
  return (
    <div className={cn('hero-line', className)} style={{ animationDelay: `${start}ms` }}>
      {text}
    </div>
  )
}
