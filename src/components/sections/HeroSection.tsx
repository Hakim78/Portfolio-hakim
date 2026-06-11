'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Scramble text effect hook
function useScrambleText(finalText: string, duration: number = 1500) {
  const [displayText, setDisplayText] = useState('')
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>[]'

  const scramble = useCallback(() => {
    let iteration = 0
    const finalLength = finalText.length
    const interval = duration / (finalLength * 3)

    const intervalId = setInterval(() => {
      setDisplayText(
        finalText
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' '
            if (index < iteration / 3) {
              return finalText[index]
            }
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join('')
      )

      iteration++

      if (iteration >= finalLength * 3) {
        clearInterval(intervalId)
        setDisplayText(finalText)
      }
    }, interval)

    return () => clearInterval(intervalId)
  }, [finalText, duration, chars])

  return { displayText, scramble }
}

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const hudRef = useRef<HTMLDivElement>(null)

  const { displayText: developerText, scramble: scrambleDeveloper } = useScrambleText('DEVELOPER', 1200)

  useEffect(() => {
    if (typeof window === 'undefined') return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Create master timeline
      const tl = gsap.timeline({ delay: 0.3 })

      // Reveal HAKIM with clip-path from bottom
      tl.to(titleRef.current, {
        clipPath: 'inset(0% 0 0% 0)',
        duration: 1.2,
        ease: 'power4.out',
      })

      // Start scramble effect after title reveals
      tl.add(() => { scrambleDeveloper() }, '-=0.3')

      // Animate HUD elements
      tl.fromTo(
        '.hud-item',
        { opacity: 0, x: 20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
        },
        '-=0.8'
      )

      // Animate bottom stats
      tl.fromTo(
        '.stat-item',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power3.out',
        },
        '-=0.4'
      )

      // Animate CTA buttons
      tl.fromTo(
        '.cta-btn',
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power3.out',
        },
        '-=0.3'
      )

      // Parallax effect on scroll
      gsap.to(titleRef.current, {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      })

      gsap.to(subtitleRef.current, {
        yPercent: 50,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      })

      gsap.to(hudRef.current, {
        yPercent: 20,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '50% top',
          scrub: 1,
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [scrambleDeveloper])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Main content - Asymmetric layout */}
      <div className="relative z-10 w-full">
        {/* Title Section - Left aligned */}
        <div className="px-6 lg:px-12 xl:px-20">
          {/* Status indicator */}
          <div className="mb-8 flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-mono text-dark-600 tracking-widest">
              AVAILABLE FOR WORK
            </span>
          </div>

          {/* Main title - HAKIM */}
          <h1
            ref={titleRef}
            className="font-display font-bold leading-[0.85] tracking-tighter"
            style={{
              fontSize: 'clamp(4rem, 15vw, 14rem)',
              clipPath: 'inset(100% 0 0% 0)',
            }}
          >
            <span className="block text-white">HAKIM</span>
          </h1>

          {/* Subtitle - DEVELOPER (outline style) */}
          <div ref={subtitleRef} className="relative -mt-[2vw] ml-[5vw]">
            <h2
              className="font-mono font-bold text-outline tracking-[0.15em]"
              style={{ fontSize: 'clamp(2rem, 8vw, 8rem)' }}
            >
              {developerText || '\u00A0'}
              <span className="animate-pulse text-primary">_</span>
            </h2>
          </div>

          {/* Description */}
          <p className="max-w-xl mt-8 text-lg md:text-xl text-dark-600 leading-relaxed">
            Building <span className="text-white">AI systems</span> that solve{' '}
            <span className="text-primary">real problems</span>. From prototype to
            production, from data to deployment.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mt-10">
            <Link
              href="/projects"
              className="cta-btn group inline-flex items-center gap-3 px-8 py-4 bg-primary text-white font-medium tracking-wide hover:bg-primary-600 transition-all duration-300"
            >
              <span>VIEW PROJECTS</span>
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
            <Link
              href="/contact"
              className="cta-btn inline-flex items-center gap-3 px-8 py-4 border border-dark-300 text-white font-medium tracking-wide hover:border-primary hover:text-primary transition-all duration-300"
            >
              <span>CONTACT</span>
            </Link>
          </div>
        </div>

        {/* HUD Panel - Right side */}
        <div
          ref={hudRef}
          className="absolute top-1/2 right-6 lg:right-12 xl:right-20 -translate-y-1/2 hidden lg:block"
        >
          <div className="hud-border p-6 space-y-6 hud-corner relative">
            {/* Coordinates */}
            <div className="hud-item">
              <div className="text-[10px] font-mono text-dark-500 mb-1">
                LOCATION
              </div>
              <div className="font-mono text-sm text-white hud-text">
                48.8566° N, 2.3522° E
              </div>
              <div className="text-xs text-dark-600">Île-de-France, FR</div>
            </div>

            {/* Status */}
            <div className="hud-item">
              <div className="text-[10px] font-mono text-dark-500 mb-1">
                STATUS
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                <span className="font-mono text-sm text-green-400">ONLINE</span>
              </div>
            </div>

            {/* Education */}
            <div className="hud-item">
              <div className="text-[10px] font-mono text-dark-500 mb-1">
                EDUCATION
              </div>
              <div className="font-mono text-sm text-white">M2 BIG DATA & AI</div>
              <div className="text-xs text-dark-600">IPSSI Paris</div>
            </div>

            {/* Focus */}
            <div className="hud-item">
              <div className="text-[10px] font-mono text-dark-500 mb-1">
                FOCUS
              </div>
              <div className="space-y-1 text-xs font-mono text-primary">
                <div>// Computer Vision</div>
                <div>// NLP & Transformers</div>
                <div>// MLOps</div>
                <div>// Full-Stack</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom stats bar */}
        <div className="absolute bottom-12 left-0 right-0 px-6 lg:px-12 xl:px-20">
          <div className="flex flex-wrap items-end justify-between gap-8 pt-8 border-t border-dark-300/50">
            <div className="flex flex-wrap gap-12">
              <div className="stat-item">
                <div className="text-4xl md:text-5xl font-display font-bold text-white">
                  15<span className="text-primary">+</span>
                </div>
                <div className="text-xs font-mono text-dark-600 mt-1 tracking-widest">
                  PROJECTS
                </div>
              </div>
              <div className="stat-item">
                <div className="text-4xl md:text-5xl font-display font-bold text-white">
                  5<span className="text-primary">+</span>
                </div>
                <div className="text-xs font-mono text-dark-600 mt-1 tracking-widest">
                  IN PRODUCTION
                </div>
              </div>
              <div className="stat-item">
                <div className="text-4xl md:text-5xl font-display font-bold text-white">
                  3<span className="text-primary">+</span>
                </div>
                <div className="text-xs font-mono text-dark-600 mt-1 tracking-widest">
                  YEARS EXP
                </div>
              </div>
            </div>

            {/* Scroll indicator */}
            <div className="stat-item flex items-center gap-3 text-dark-500">
              <span className="text-xs font-mono tracking-widest">SCROLL</span>
              <div className="w-px h-12 bg-dark-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-4 bg-primary"
                     style={{ animation: 'scrollPulse 2s ease-in-out infinite' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background scan line effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
          style={{
            animation: 'scanDown 8s linear infinite',
          }}
        />
      </div>

      <style jsx>{`
        @keyframes scanDown {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes scrollPulse {
          0%, 100% { transform: translateY(-100%); }
          50% { transform: translateY(300%); }
        }
      `}</style>
    </section>
  )
}
