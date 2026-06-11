'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { skills } from '@/data/skills'
import { cn } from '@/lib/utils'

const categoryColors = {
  language: 'border-yellow-500/30 hover:border-yellow-500/50',
  framework: 'border-blue-500/30 hover:border-blue-500/50',
  'ai-ml': 'border-purple-500/30 hover:border-purple-500/50',
  data: 'border-cyan-500/30 hover:border-cyan-500/50',
  devops: 'border-orange-500/30 hover:border-orange-500/50',
  tool: 'border-green-500/30 hover:border-green-500/50',
}

const categoryLabels = {
  language: 'Langages',
  framework: 'Frameworks',
  'ai-ml': 'IA & ML',
  data: 'Data',
  devops: 'DevOps',
  tool: 'Outils',
}

export function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Animate title
      gsap.fromTo(
        titleRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
          },
        }
      )

      // Animate skill items with stagger
      gsap.fromTo(
        '.skill-item',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.02,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.skills-grid',
            start: 'top 80%',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Group skills by category
  const groupedSkills = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = []
      }
      acc[skill.category].push(skill)
      return acc
    },
    {} as Record<string, typeof skills>
  )

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-dark-50/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-mono text-primary">02</span>
            <div className="h-px flex-1 bg-dark-300" />
          </div>
          <h2
            ref={titleRef}
            className="text-display-md font-display font-bold"
          >
            Compétences
            <span className="text-dark-500"> Techniques</span>
          </h2>
        </div>

        {/* Skills by Category */}
        <div className="skills-grid space-y-12">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category}>
              <h3 className="text-sm font-mono text-dark-500 mb-4">
                {categoryLabels[category as keyof typeof categoryLabels]}
              </h3>
              <div className="flex flex-wrap gap-3">
                {categorySkills.map((skill) => (
                  <div
                    key={skill.name}
                    className={cn(
                      'skill-item px-4 py-2 border rounded-lg bg-dark-100/50 transition-all duration-300 cursor-default',
                      categoryColors[skill.category as keyof typeof categoryColors]
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">
                        {skill.name}
                      </span>
                      {skill.featured && (
                        <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                      )}
                    </div>
                    {/* Level indicator */}
                    <div className="flex gap-0.5 mt-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={cn(
                            'w-4 h-0.5 rounded-full transition-colors',
                            level <= skill.level ? 'bg-primary' : 'bg-dark-300'
                          )}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Focus Areas */}
        <div className="mt-16 pt-16 border-t border-dark-300">
          <h3 className="text-sm font-mono text-dark-500 mb-6">
            Domaines de prédilection
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                icon: '🧠',
                title: 'Computer Vision',
                description: 'CNNs, classification, détection d\'objets',
              },
              {
                icon: '💬',
                title: 'NLP',
                description: 'Transformers, LLMs, Q&A systems',
              },
              {
                icon: '🤖',
                title: 'MLOps',
                description: 'Déploiement, monitoring, scaling',
              },
              {
                icon: '🚁',
                title: 'Navigation Autonome',
                description: 'Visual Odometry, SLAM',
              },
            ].map((area, index) => (
              <div
                key={index}
                className="skill-item p-6 border border-dark-300 rounded-lg hover:border-primary/30 transition-colors"
              >
                <div className="text-3xl mb-4">{area.icon}</div>
                <h4 className="font-display font-semibold mb-2">{area.title}</h4>
                <p className="text-sm text-dark-600">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
