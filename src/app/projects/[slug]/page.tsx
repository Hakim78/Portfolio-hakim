'use client'

import { use, useRef, useEffect } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '@/data/projects'
import { cn } from '@/lib/utils'

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

interface PageProps {
  params: Promise<{ slug: string }>
}

export default function ProjectPage({ params }: PageProps) {
  const { slug } = use(params)
  const project = projects.find((p) => p.slug === slug)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.animate-in',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
        }
      )
    }, contentRef)

    return () => ctx.revert()
  }, [])

  if (!project) {
    notFound()
  }

  // Find related projects
  const relatedProjects = projects
    .filter((p) => p.slug !== slug && p.category === project.category)
    .slice(0, 3)

  return (
    <div ref={contentRef} className="pt-32 pb-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/projects"
          className="animate-in inline-flex items-center gap-2 text-sm text-dark-600 hover:text-primary transition-colors mb-12"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16l-4-4m0 0l4-4m-4 4h18"
            />
          </svg>
          Retour aux projets
        </Link>

        {/* Header */}
        <header className="mb-16">
          <div className="animate-in flex flex-wrap items-center gap-3 mb-6">
            <span
              className={cn(
                'px-3 py-1 text-xs font-mono border rounded-full',
                categoryColors[project.category]
              )}
            >
              {categoryLabels[project.category]}
            </span>
            <span className="text-sm text-dark-500">{project.year}</span>
            <span className="text-sm text-dark-500">•</span>
            <span className="text-sm text-primary">
              {statusLabels[project.status]}
            </span>
          </div>

          <h1 className="animate-in text-display-md font-display font-bold mb-6">
            {project.title}
          </h1>

          <p className="animate-in text-xl text-dark-600 leading-relaxed">
            {project.longDescription || project.description}
          </p>

          {/* Links */}
          <div className="animate-in flex flex-wrap gap-4 mt-8">
            {project.urlLive && (
              <a
                href={project.urlLive}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-600 transition-all"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                Voir le site
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 border border-dark-300 text-white font-medium rounded-lg hover:border-primary hover:text-primary transition-all"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                GitHub
              </a>
            )}
            {project.huggingface && (
              <a
                href={project.huggingface}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 border border-dark-300 text-white font-medium rounded-lg hover:border-primary hover:text-primary transition-all"
              >
                🤗 HuggingFace
              </a>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="space-y-16">
          {/* Metrics */}
          {project.metrics.length > 0 && (
            <section className="animate-in">
              <h2 className="text-sm font-mono text-dark-500 mb-6">
                RÉSULTATS & MÉTRIQUES
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {project.metrics.map((metric, index) => (
                  <div
                    key={index}
                    className="p-6 border border-dark-300 rounded-lg bg-dark-100/50"
                  >
                    <div className="text-lg font-mono text-primary">
                      {metric}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Features */}
          {project.features.length > 0 && (
            <section className="animate-in">
              <h2 className="text-sm font-mono text-dark-500 mb-6">
                FONCTIONNALITÉS
              </h2>
              <ul className="space-y-4">
                {project.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-dark-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Tech Stack */}
          <section className="animate-in">
            <h2 className="text-sm font-mono text-dark-500 mb-6">
              STACK TECHNIQUE
            </h2>
            <div className="flex flex-wrap gap-3">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 text-sm border border-dark-300 rounded-lg bg-dark-100/50 hover:border-primary/50 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>

          {/* Innovation */}
          {project.innovation && (
            <section className="animate-in">
              <h2 className="text-sm font-mono text-dark-500 mb-6">
                INNOVATION
              </h2>
              <div className="p-6 border border-primary/30 rounded-lg bg-primary/5">
                <p className="text-lg text-primary">{project.innovation}</p>
              </div>
            </section>
          )}
        </div>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <section className="mt-24 pt-12 border-t border-dark-300">
            <h2 className="text-sm font-mono text-dark-500 mb-6">
              PROJETS SIMILAIRES
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.map((related) => (
                <Link
                  key={related.slug}
                  href={`/projects/${related.slug}`}
                  className="group p-6 border border-dark-300 rounded-lg hover:border-primary/30 transition-colors"
                >
                  <span
                    className={cn(
                      'inline-flex px-2 py-1 text-xs font-mono border rounded mb-3',
                      categoryColors[related.category]
                    )}
                  >
                    {categoryLabels[related.category]}
                  </span>
                  <h3 className="font-display font-semibold group-hover:text-primary transition-colors">
                    {related.shortTitle || related.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
