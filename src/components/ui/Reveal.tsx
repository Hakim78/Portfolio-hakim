'use client'

import { createElement, useEffect, useRef, type ElementType } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type Props = {
  as?: ElementType
  text: string
  className?: string
  delay?: number
}

/**
 * Révélation par lignes masquées (chaque ligne monte derrière un masque),
 * déclenchée au scroll. Le découpage en lignes est mesuré dans le DOM,
 * sans plugin : un span par mot, regroupement par offsetTop.
 */
export function Reveal({ as = 'p', text, className, delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const split = () => {
      el.innerHTML = text
        .split(' ')
        .map((w) => `<span class="reveal-word" style="display:inline-block">${w}</span>`)
        .join(' ')
      const words = Array.from(el.querySelectorAll<HTMLSpanElement>('.reveal-word'))
      const lines: string[][] = []
      let top: number | null = null
      for (const w of words) {
        if (w.offsetTop !== top) {
          top = w.offsetTop
          lines.push([])
        }
        lines[lines.length - 1].push(w.textContent ?? '')
      }
      el.innerHTML = lines
        .map((l) => `<span class="reveal-line"><span class="reveal-inner">${l.join(' ')}</span></span>`)
        .join('')
      return Array.from(el.querySelectorAll<HTMLSpanElement>('.reveal-inner'))
    }

    let done = false
    let width = el.clientWidth
    let inners = split()
    gsap.set(inners, { yPercent: 110 })

    const tween = gsap.to(inners, {
      yPercent: 0,
      duration: 1.2,
      ease: 'main',
      stagger: 0.09,
      delay,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      onComplete: () => {
        done = true
      },
    })

    // Nouvelle largeur → on remesure les lignes (sans rejouer l'animation si déjà révélé)
    const ro = new ResizeObserver(() => {
      if (el.clientWidth === width) return
      width = el.clientWidth
      inners = split()
      gsap.set(inners, { yPercent: done ? 0 : 110 })
    })
    ro.observe(el)

    return () => {
      ro.disconnect()
      tween.scrollTrigger?.kill()
      tween.kill()
      el.textContent = text
    }
  }, [text, delay])

  return createElement(as, { ref, className, 'data-reveal': '' }, text)
}
