'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

/**
 * « Bracket heading » : [ Profil ]. Au scroll (scrub), les crochets
 * s'écartent jusqu'à leur place et le mot passe de flou à net.
 */
export function SectionLabel({ children, className }: { children: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const left = el.querySelector('.bk-l')
    const word = el.querySelector('.bk-w')
    const right = el.querySelector('.bk-r')
    const tl = gsap
      .timeline({ scrollTrigger: { trigger: el, start: 'top 94%', end: 'top 58%', scrub: true } })
      .fromTo(left, { x: '1em' }, { x: 0, ease: 'none' }, 0)
      .fromTo(right, { x: '-1em' }, { x: 0, ease: 'none' }, 0)
      .fromTo(word, { filter: 'blur(5px)', opacity: 0.25 }, { filter: 'blur(0px)', opacity: 1, ease: 'none' }, 0)

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [])

  return (
    <p ref={ref} className={cn('label inline-flex items-center gap-[0.45em] text-fg/50', className)}>
      <span className="bk-l">[</span>
      <span className="bk-w">{children}</span>
      <span className="bk-r">]</span>
    </p>
  )
}
