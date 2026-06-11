'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'
import type { Project } from '@/data/projects'

interface ProjectCardProps {
  project: Project
  index: number
  variant?: 'default' | 'featured' | 'list'
}

const categoryColors = {
  'ia-ml': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  fullstack: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'data-engineering': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  devops: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  mobile: 'bg-green-500/10 text-green-400 border-green-500/20',
}

const categoryLabels = {
  'ia-ml': 'IA & ML',
  fullstack: 'Full-Stack',
  'data-engineering': 'Data Engineering',
  devops: 'DevOps',
  mobile: 'Mobile',
}

const statusLabels = {
  production: 'En production',
  completed: 'Terminé',
  'in-progress': 'En cours',
}

const statusColors = {
  production: 'text-green-400',
  completed: 'text-blue-400',
  'in-progress': 'text-yellow-400',
}

export function ProjectCard({
  project,
  index,
  variant = 'default',
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 85%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    })

    return () => ctx.revert()
  }, [])

  if (variant === 'list') {
    return (
      <Link href={`/projects/${project.slug}`}>
        <div
          ref={cardRef}
          className="group grid grid-cols-12 gap-4 py-6 border-b border-dark-300 hover:border-primary/50 transition-colors cursor-pointer"
        >
          {/* Index */}
          <div className="col-span-1 text-sm font-mono text-dark-500">
            {String(index + 1).padStart(2, '0')}
          </div>

          {/* Title */}
          <div className="col-span-5 md:col-span-4">
            <h3 className="font-display font-semibold text-lg group-hover:text-primary transition-colors">
              {project.shortTitle || project.title}
            </h3>
          </div>

          {/* Category */}
          <div className="col-span-3 md:col-span-2 hidden md:block">
            <span
              className={cn(
                'inline-flex px-2 py-1 text-xs font-mono border rounded',
                categoryColors[project.category]
              )}
            >
              {categoryLabels[project.category]}
            </span>
          </div>

          {/* Status */}
          <div className="col-span-2 hidden md:block">
            <span
              className={cn(
                'text-sm font-mono',
                statusColors[project.status]
              )}
            >
              {statusLabels[project.status]}
            </span>
          </div>

          {/* Year */}
          <div className="col-span-4 md:col-span-2 text-right">
            <span className="text-sm text-dark-500">{project.year}</span>
          </div>

          {/* Arrow */}
          <div className="col-span-1 flex justify-end items-center">
            <svg
              className="w-4 h-4 text-dark-500 group-hover:text-primary group-hover:translate-x-1 transition-all"
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
          </div>
        </div>
      </Link>
    )
  }

  if (variant === 'featured') {
    return (
      <Link href={`/projects/${project.slug}`}>
        <div
          ref={cardRef}
          className="group relative overflow-hidden rounded-2xl border border-dark-300 hover:border-primary/50 transition-all duration-500 cursor-pointer"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Content */}
          <div className="relative p-8">
            {/* Top row */}
            <div className="flex items-start justify-between mb-6">
              <span
                className={cn(
                  'inline-flex px-3 py-1 text-xs font-mono border rounded-full',
                  categoryColors[project.category]
                )}
              >
                {categoryLabels[project.category]}
              </span>
              {project.innovation && (
                <span className="text-xs text-primary font-mono">
                  {project.innovation}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="text-2xl md:text-3xl font-display font-bold mb-4 group-hover:text-primary transition-colors">
              {project.shortTitle || project.title}
            </h3>

            {/* Description */}
            <p className="text-dark-600 leading-relaxed mb-6 line-clamp-3">
              {project.description}
            </p>

            {/* Tech stack preview */}
            <div className="flex flex-wrap gap-2 mb-6">
              {project.stack.slice(0, 5).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 text-xs text-dark-600 bg-dark-100 rounded"
                >
                  {tech}
                </span>
              ))}
              {project.stack.length > 5 && (
                <span className="px-2 py-1 text-xs text-dark-500">
                  +{project.stack.length - 5}
                </span>
              )}
            </div>

            {/* Metrics */}
            {project.metrics.length > 0 && (
              <div className="flex flex-wrap gap-4 mb-6">
                {project.metrics.slice(0, 2).map((metric, i) => (
                  <div key={i} className="text-sm">
                    <span className="text-primary font-mono">{metric}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom row */}
            <div className="flex items-center justify-between pt-4 border-t border-dark-300">
              <span className={cn('text-sm font-mono', statusColors[project.status])}>
                {statusLabels[project.status]}
              </span>
              <div className="flex items-center gap-2 text-sm text-dark-500 group-hover:text-primary transition-colors">
                <span>Voir le projet</span>
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
              </div>
            </div>
          </div>

          {/* Decorative corner */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </Link>
    )
  }

  // Default card variant
  return (
    <Link href={`/projects/${project.slug}`}>
      <div
        ref={cardRef}
        className="group relative overflow-hidden rounded-lg border border-dark-300 hover:border-primary/30 transition-all duration-300 cursor-pointer h-full"
      >
        <div className="p-6">
          {/* Category */}
          <span
            className={cn(
              'inline-flex px-2 py-1 text-xs font-mono border rounded mb-4',
              categoryColors[project.category]
            )}
          >
            {categoryLabels[project.category]}
          </span>

          {/* Title */}
          <h3 className="text-lg font-display font-semibold mb-2 group-hover:text-primary transition-colors">
            {project.shortTitle || project.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-dark-600 leading-relaxed mb-4 line-clamp-2">
            {project.description}
          </p>

          {/* Stack preview */}
          <div className="flex flex-wrap gap-1 mb-4">
            {project.stack.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 text-xs text-dark-500 bg-dark-100 rounded"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-dark-500">
            <span className={statusColors[project.status]}>
              {statusLabels[project.status]}
            </span>
            <span>{project.year}</span>
          </div>
        </div>

        {/* Hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>
    </Link>
  )
}
