'use client'

import { useEffect, useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Use useLayoutEffect on client, useEffect on server
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

// Register plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function useGSAP() {
  const contextRef = useRef<gsap.Context | null>(null)

  useIsomorphicLayoutEffect(() => {
    contextRef.current = gsap.context(() => {})

    return () => {
      contextRef.current?.revert()
    }
  }, [])

  return contextRef
}

export function useScrollTrigger(
  callback: () => void,
  deps: React.DependencyList = []
) {
  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      callback()
    })

    return () => {
      ctx.revert()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

export function useSplitText(
  ref: React.RefObject<HTMLElement>,
  options?: {
    type?: 'chars' | 'words' | 'lines'
    stagger?: number
    duration?: number
    delay?: number
    y?: number
    trigger?: string | HTMLElement
    start?: string
    end?: string
  }
) {
  const {
    type = 'chars',
    stagger = 0.02,
    duration = 0.6,
    delay = 0,
    trigger,
    start = 'top 80%',
    end = 'bottom 20%',
  } = options || {}

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return

    const element = ref.current
    const text = element.textContent || ''

    let items: string[] = []
    if (type === 'chars') {
      items = text.split('')
    } else if (type === 'words') {
      items = text.split(' ')
    } else {
      items = text.split('\n')
    }

    // Clear and rebuild with spans
    element.innerHTML = items
      .map(
        (item, i) =>
          `<span class="split-word" style="display: inline-block; overflow: hidden;"><span class="split-item" style="display: inline-block; transform: translateY(100%); opacity: 0;">${item}${type === 'words' ? (i < items.length - 1 ? '&nbsp;' : '') : ''}</span></span>`
      )
      .join('')

    const splitItems = element.querySelectorAll('.split-item')

    const ctx = gsap.context(() => {
      gsap.to(splitItems, {
        y: 0,
        opacity: 1,
        duration,
        stagger,
        delay,
        ease: 'power3.out',
        scrollTrigger: trigger
          ? {
              trigger: trigger || element,
              start,
              end,
              toggleActions: 'play none none reverse',
            }
          : undefined,
      })
    })

    return () => {
      ctx.revert()
      element.textContent = text
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref])
}

export { gsap, ScrollTrigger }
