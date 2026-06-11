'use client'

import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects, categories, type CategoryId } from '@/data/projects'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { cn } from '@/lib/utils'

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const headerRef = useRef<HTMLDivElement>(null)
  const filtersRef = useRef<HTMLDivElement>(null)

  const filteredProjects =
    activeCategory === 'all'
      ? projects
      : projects.filter((p) => p.category === activeCategory)

  useEffect(() => {
    if (typeof window === 'undefined') return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
        }
      )

      gsap.fromTo(
        filtersRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: 0.2,
          ease: 'power3.out',
        }
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-mono text-primary">PROJETS</span>
            <div className="h-px flex-1 bg-dark-300" />
          </div>
          <h1 className="text-display-lg font-display font-bold mb-6">
            Tous les
            <span className="text-dark-500"> Projets</span>
          </h1>
          <p className="max-w-2xl text-lg text-dark-600">
            Une sélection de projets personnels, académiques et professionnels
            couvrant le développement Full-Stack, l&apos;IA/ML et le Data Engineering.
          </p>
        </div>

        {/* Filters and View Toggle */}
        <div
          ref={filtersRef}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12"
        >
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  'px-4 py-2 text-sm font-mono border rounded-lg transition-all',
                  activeCategory === cat.id
                    ? 'bg-primary text-white border-primary'
                    : 'bg-transparent text-dark-600 border-dark-300 hover:border-primary hover:text-white'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 p-1 border border-dark-300 rounded-lg">
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded transition-colors',
                viewMode === 'list'
                  ? 'bg-primary text-white'
                  : 'text-dark-600 hover:text-white'
              )}
              aria-label="List view"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 rounded transition-colors',
                viewMode === 'grid'
                  ? 'bg-primary text-white'
                  : 'text-dark-600 hover:text-white'
              )}
              aria-label="Grid view"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Projects Count */}
        <div className="text-sm text-dark-500 mb-8">
          {filteredProjects.length} projet
          {filteredProjects.length > 1 ? 's' : ''}
        </div>

        {/* Projects List/Grid */}
        {viewMode === 'list' ? (
          <div className="border-t border-dark-300">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.slug}
                project={project}
                index={index}
                variant="list"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.slug}
                project={project}
                index={index}
                variant="default"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
