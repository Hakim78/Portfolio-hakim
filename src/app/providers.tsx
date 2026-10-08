'use client'

import { ReactNode, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomEase } from 'gsap/CustomEase'
import { setLenis } from '@/lib/lenis'
import { setTransitionNavigate } from '@/lib/transition'
import { site } from '@/data/site'

gsap.registerPlugin(ScrollTrigger, CustomEase)

// Easing global « main » (voir inspiration alejandroha) : départ vif, arrivée longue.
if (!CustomEase.get('main')) {
  CustomEase.create('main', '0.625, 0.05, 0, 1')
}
gsap.defaults({ ease: 'main', duration: 0.8 })

/**
 * - Scroll inertiel (Lenis) synchronisé avec ScrollTrigger, ancres internes gérées par Lenis.
 * - Transition de page : un voile clair monte, la nouvelle page se charge, le voile sort par le haut.
 */
export function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const overlayRef = useRef<HTMLDivElement>(null)
  const pending = useRef(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const overlay = overlayRef.current

    const lenis = new Lenis({
      lerp: reduced ? 1 : 0.085,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      smoothWheel: !reduced,
    })
    setLenis(lenis)

    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    document.documentElement.classList.add('lenis', 'lenis-smooth')

    const scrollToHash = (hash: string) => {
      const target = hash ? document.getElementById(hash.replace(/^#/, '')) : null
      if (target) lenis.scrollTo(target, { duration: reduced ? 0 : 1.4 })
      return !!target
    }

    // Transition : voile qui monte, puis navigation
    let fallback = 0
    const go = (href: string) => {
      if (reduced || !overlay) {
        router.push(href)
        return
      }
      if (pending.current) return
      pending.current = true
      gsap.killTweensOf(overlay)
      gsap.fromTo(
        overlay,
        { yPercent: 100 },
        { yPercent: 0, duration: 0.55, ease: 'main', onComplete: () => router.push(href) }
      )
      // Sécurité : si la page ne change pas, on libère l'écran
      window.clearTimeout(fallback)
      fallback = window.setTimeout(() => {
        if (pending.current) {
          pending.current = false
          gsap.to(overlay, {
            yPercent: -100,
            duration: 0.6,
            ease: 'main',
            onComplete: () => {
              gsap.set(overlay, { yPercent: 100 })
            },
          })
        }
      }, 5000)
    }
    setTransitionNavigate(go)

    // Clics sur liens internes (phase de capture : avant next/link)
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href]')
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return
      const raw = a.getAttribute('href') ?? ''
      const url = new URL(a.href, window.location.href)
      if (url.origin !== window.location.origin) return

      const samePage = url.pathname === window.location.pathname && url.search === window.location.search
      if (raw.startsWith('#') || samePage) {
        if (url.hash && scrollToHash(url.hash)) {
          e.preventDefault()
          e.stopPropagation()
        }
        return
      }
      e.preventDefault()
      e.stopPropagation()
      go(url.pathname + url.search + url.hash)
    }
    document.addEventListener('click', onClick, true)

    return () => {
      document.removeEventListener('click', onClick, true)
      window.clearTimeout(fallback)
      setTransitionNavigate(null)
      gsap.ticker.remove(tick)
      lenis.destroy()
      setLenis(null)
      document.documentElement.classList.remove('lenis', 'lenis-smooth')
    }
  }, [router])

  // Nouvelle page : haut de page (ou ancre), triggers recalculés, voile qui sort
  useEffect(() => {
    const hash = window.location.hash
    const target = hash ? document.getElementById(hash.slice(1)) : null
    if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: 'auto' }))
    else window.scrollTo(0, 0)

    const t = window.setTimeout(() => ScrollTrigger.refresh(), 150)

    const overlay = overlayRef.current
    if (pending.current && overlay) {
      pending.current = false
      gsap.to(overlay, {
        yPercent: -100,
        duration: 0.7,
        delay: 0.1,
        ease: 'main',
        onComplete: () => {
          gsap.set(overlay, { yPercent: 100 })
        },
      })
    }
    return () => window.clearTimeout(t)
  }, [pathname])

  return (
    <>
      {children}
      <div
        ref={overlayRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center bg-fg text-bg"
        style={{ transform: 'translateY(100%)' }}
      >
        <span className="label">
          {site.name} — {site.role}
        </span>
      </div>
    </>
  )
}
