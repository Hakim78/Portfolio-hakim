'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'

const timeline = [
  {
    year: '2024 - Présent',
    title: 'Master 2 Big Data & IA',
    organization: 'IPSSI Paris',
    description:
      'Spécialisation en intelligence artificielle, machine learning et traitement de données à grande échelle.',
    type: 'education',
  },
  {
    year: '2024',
    title: 'Développeur Full-Stack & IA',
    organization: 'SP Formation',
    description:
      'Développement de plateformes SaaS (SEO, E-réputation, LLM Monitoring). Architecture cloud, APIs IA.',
    type: 'work',
  },
  {
    year: '2023 - 2024',
    title: 'Master 1 Big Data & IA',
    organization: 'IPSSI Paris',
    description:
      'Fondamentaux du machine learning, deep learning, traitement du langage naturel et vision par ordinateur.',
    type: 'education',
  },
  {
    year: '2023 - 2024',
    title: 'Développeur Full-Stack',
    organization: 'Intuition Robotique & Technologie',
    description:
      'Développement e-commerce React/Node.js, application mobile Flutter, intégrations API.',
    type: 'work',
  },
  {
    year: '2022 - 2023',
    title: 'Bachelor Développement Web',
    organization: 'IPSSI Paris',
    description:
      'Développement web moderne, bases de données, méthodologies agiles.',
    type: 'education',
  },
]

const values = [
  {
    icon: '🔬',
    title: 'From Scratch',
    description:
      "J'implémente des algorithmes from scratch pour comprendre en profondeur avant d'utiliser des frameworks.",
  },
  {
    icon: '🚀',
    title: 'Production-Ready',
    description:
      'Chaque projet est pensé pour être déployé : scalabilité, monitoring, documentation.',
  },
  {
    icon: '📊',
    title: 'Data-Driven',
    description:
      'Des métriques concrètes pour mesurer et améliorer continuellement les performances.',
  },
  {
    icon: '🧠',
    title: 'Curiosité',
    description:
      'Exploration constante des dernières avancées en IA : LLMs, vision, navigation autonome.',
  },
]

export default function AboutPage() {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Animate header
      gsap.fromTo(
        '.about-header',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
        }
      )

      // Animate timeline items
      gsap.fromTo(
        '.timeline-item',
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.timeline',
            start: 'top 80%',
          },
        }
      )

      // Animate value cards
      gsap.fromTo(
        '.value-card',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.values-grid',
            start: 'top 80%',
          },
        }
      )
    }, contentRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={contentRef} className="pt-32 pb-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        {/* Header */}
        <header className="about-header mb-24">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-mono text-primary">À PROPOS</span>
            <div className="h-px flex-1 bg-dark-300" />
          </div>

          <h1 className="text-display-lg font-display font-bold mb-8">
            Développeur
            <br />
            <span className="text-dark-500">Full-Stack & IA</span>
          </h1>

          <div className="prose prose-invert max-w-none">
            <p className="text-xl text-dark-600 leading-relaxed mb-6">
              Passionné par la création de systèmes intelligents, je combine
              expertise en développement web moderne et compétences avancées en
              intelligence artificielle.
            </p>
            <p className="text-lg text-dark-600 leading-relaxed">
              Actuellement en Master 2 Big Data & IA à l&apos;IPSSI, je recherche une
              alternance où je pourrai contribuer à des projets ambitieux mêlant
              développement logiciel et machine learning.
            </p>
          </div>

          {/* Quick info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-12 border-t border-dark-300">
            <div>
              <div className="text-sm text-dark-500 mb-1">Localisation</div>
              <div className="font-medium">Île-de-France</div>
            </div>
            <div>
              <div className="text-sm text-dark-500 mb-1">Disponibilité</div>
              <div className="font-medium text-green-400">Alternance</div>
            </div>
            <div>
              <div className="text-sm text-dark-500 mb-1">Formation</div>
              <div className="font-medium">M2 Big Data & IA</div>
            </div>
            <div>
              <div className="text-sm text-dark-500 mb-1">Expérience</div>
              <div className="font-medium">3+ ans</div>
            </div>
          </div>
        </header>

        {/* Timeline */}
        <section className="mb-24">
          <h2 className="text-sm font-mono text-dark-500 mb-8">PARCOURS</h2>

          <div className="timeline relative">
            {/* Vertical line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-dark-300 -translate-x-1/2" />

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    'timeline-item relative grid grid-cols-1 md:grid-cols-2 gap-8',
                    index % 2 === 0 ? 'md:text-right' : ''
                  )}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-0 md:left-1/2 top-0 w-3 h-3 bg-primary rounded-full -translate-x-1/2 z-10" />

                  {/* Content */}
                  <div
                    className={cn(
                      'pl-8 md:pl-0',
                      index % 2 === 0 ? 'md:pr-12' : 'md:col-start-2 md:pl-12'
                    )}
                  >
                    <span
                      className={cn(
                        'inline-block px-2 py-1 text-xs font-mono rounded mb-2',
                        item.type === 'education'
                          ? 'bg-purple-500/10 text-purple-400'
                          : 'bg-blue-500/10 text-blue-400'
                      )}
                    >
                      {item.type === 'education' ? 'Formation' : 'Expérience'}
                    </span>
                    <div className="text-sm text-dark-500 mb-2">{item.year}</div>
                    <h3 className="text-xl font-display font-semibold mb-1">
                      {item.title}
                    </h3>
                    <div className="text-primary mb-3">{item.organization}</div>
                    <p className="text-dark-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mb-24">
          <h2 className="text-sm font-mono text-dark-500 mb-8">
            CE QUI ME DIFFÉRENCIE
          </h2>

          <div className="values-grid grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="value-card p-6 border border-dark-300 rounded-lg hover:border-primary/30 transition-colors"
              >
                <div className="text-3xl mb-4">{value.icon}</div>
                <h3 className="text-lg font-display font-semibold mb-2">
                  {value.title}
                </h3>
                <p className="text-dark-600">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Soft Skills */}
        <section>
          <h2 className="text-sm font-mono text-dark-500 mb-8">SOFT SKILLS</h2>

          <div className="flex flex-wrap gap-3">
            {[
              'Autonomie',
              'Rigueur',
              'Curiosité intellectuelle',
              'Communication',
              'Travail en équipe',
              'Résolution de problèmes',
              'Adaptabilité',
              'Veille technologique',
            ].map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 text-sm border border-dark-300 rounded-lg bg-dark-100/50"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
