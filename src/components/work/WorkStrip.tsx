'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Project } from '@/data/projects'
import { site } from '@/data/site'
import { getLenis } from '@/lib/lenis'
import { navigateWithTransition } from '@/lib/transition'
import { clamp, pad2 } from '@/lib/utils'
import { RollText } from '@/components/ui/RollText'
import { Strip } from './strip'

/**
 * Section épinglée sur toute la hauteur : le scroll vertical fait défiler
 * la bande horizontalement (1 px pour 1 px), avec l'inertie de Lenis.
 * Glisser à la souris / au doigt fonctionne aussi. Un clic ouvre le projet.
 */
export function WorkStrip({ projects }: { projects: Project[] }) {
  const router = useRouter()
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stripRef = useRef<Strip | null>(null)

  const [index, setIndex] = useState(0)
  const [travel, setTravel] = useState<number | null>(null)
  const [failed, setFailed] = useState(false)
  const [cursor, setCursor] = useState<'default' | 'pointer' | 'grabbing'>('default')

  useEffect(() => {
    const canvas = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let sectionTop = 0

    let strip: Strip
    try {
      strip = new Strip(
        canvas,
        projects.map((p) => ({ title: p.title, tagline: p.tagline, image: p.image })),
        {
          reducedMotion,
          getProgress: () => (strip.travel > 0 ? (window.scrollY - sectionTop) / strip.travel : 0),
          onIndex: setIndex,
        }
      )
    } catch (err) {
      console.warn('[strip] WebGL indisponible, affichage de secours', err)
      setFailed(true)
      return
    }
    stripRef.current = strip

    const measure = () => {
      strip.resize(window.innerWidth, window.innerHeight)
      sectionTop = section.getBoundingClientRect().top + window.scrollY
      setTravel(strip.travel)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(document.documentElement)

    // ── Pointeur : survol, glisser, clic ──
    let dragging = false
    let lastX = 0
    let moved = 0
    let vx = 0

    const scrollBy = (dy: number, smooth: boolean) => {
      const lenis = getLenis()
      if (lenis) lenis.scrollTo(lenis.targetScroll + dy, smooth ? { duration: 1.2 } : { immediate: true })
      else window.scrollBy(0, dy)
    }

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return
      dragging = true
      moved = 0
      vx = 0
      lastX = e.clientX
      try {
        canvas.setPointerCapture(e.pointerId)
      } catch {
        /* pointeur synthétique */
      }
      setCursor('grabbing')
    }
    const onMove = (e: PointerEvent) => {
      strip.setPointer(e.clientX, e.clientY)
      if (!dragging) {
        setCursor(strip.hitTest(e.clientX, e.clientY) >= 0 ? 'pointer' : 'default')
        return
      }
      const dx = e.clientX - lastX
      lastX = e.clientX
      moved += Math.abs(dx)
      vx = dx
      scrollBy(-dx, false)
    }
    const onUp = (e: PointerEvent) => {
      if (!dragging) return
      dragging = false
      if (moved < 6) {
        const hit = strip.hitTest(e.clientX, e.clientY)
        if (hit >= 0) navigateWithTransition(`/projects/${projects[hit].slug}`, (href) => router.push(href))
      } else if (Math.abs(vx) > 3) {
        scrollBy(-vx * 14, true) // inertie après relâchement
      }
      setCursor(strip.hitTest(e.clientX, e.clientY) >= 0 ? 'pointer' : 'default')
    }
    const onCancel = () => {
      dragging = false
      setCursor('default')
    }
    const onLeave = () => {
      strip.clearPointer()
      if (!dragging) setCursor('default')
    }
    // Molette / trackpad horizontal → avance de la bande
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
      e.preventDefault()
      scrollBy(e.deltaX, true)
    }

    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onCancel)
    canvas.addEventListener('pointerleave', onLeave)
    section.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      ro.disconnect()
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onCancel)
      canvas.removeEventListener('pointerleave', onLeave)
      section.removeEventListener('wheel', onWheel)
      strip.dispose()
      stripRef.current = null
    }
  }, [projects, router])

  if (failed) return <StripFallback projects={projects} />

  const total = projects.length
  const height = travel != null ? `calc(100svh + ${Math.round(travel)}px)` : `calc(100svh + ${(total - 1) * 61}vw)`

  return (
    <section id="work" ref={sectionRef} aria-label="Projets sélectionnés" className="relative" style={{ height }}>
      <div className="sticky top-0 h-svh overflow-hidden">
        <canvas
          ref={canvasRef}
          aria-hidden
          className="absolute inset-0 h-full w-full touch-pan-y select-none"
          style={{ cursor }}
        />

        {/* Signalétique du bas */}
        <div className="gutter label pointer-events-none absolute inset-x-0 bottom-0 flex h-[var(--header-h)] items-center justify-between">
          <p className="pointer-events-auto">
            <span>Sélection</span>
            <span className="mx-2 text-fg/40">/</span>
            <Link href="/projects" className="text-fg/50 transition-colors duration-300 hover:text-fg">
              <RollText>Index</RollText>
            </Link>
          </p>
          <p className="font-mono text-xs tabular-nums text-fg/60" aria-live="polite">
            {pad2(clamp(index, 0, total - 1) + 1)} / {pad2(total)}
          </p>
          <p className="hidden items-center gap-2 text-fg/60 md:flex">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-mint" />
            Disponible · {site.availability}
          </p>
        </div>

        {/* Accès clavier / lecteurs d'écran */}
        <ul className="sr-only">
          {projects.map((p) => (
            <li key={p.slug}>
              <Link href={`/projects/${p.slug}`}>
                {p.title} — {p.tagline}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** Sans WebGL : liste horizontale simple. */
function StripFallback({ projects }: { projects: Project[] }) {
  return (
    <section id="work" aria-label="Projets sélectionnés" className="pt-[calc(var(--header-h)+6vh)]">
      <ul className="flex snap-x snap-mandatory gap-[2vw] overflow-x-auto px-[var(--gutter)] pb-8">
        {projects.map((p) => (
          <li key={p.slug} className="w-[86vw] shrink-0 snap-center md:w-[59vw]">
            <Link href={`/projects/${p.slug}`} className="block overflow-hidden rounded-xl border border-line bg-elev">
              {p.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image} alt="" width={1750} height={1000} className="aspect-[1.75] w-full object-cover" />
              )}
              <p className="flex items-baseline gap-4 px-5 py-4">
                <span className="font-display text-lg">{p.title}</span>
                <span className="truncate text-sm text-fg/60">{p.tagline}</span>
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
