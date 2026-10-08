import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RollText } from '@/components/ui/RollText'
import { TechIcon } from '@/components/ui/TechIcon'
import { categoryLabels, getProject, projects, statusLabels } from '@/data/projects'
import { techIcon } from '@/data/tech'
import { pad2 } from '@/lib/utils'

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const p = getProject(params.slug)
  if (!p) return {}
  return {
    title: p.title,
    description: p.tagline,
    openGraph: p.image ? { images: [{ url: p.image, width: 1750, height: 1000 }] } : undefined,
  }
}

export default function ProjectPage({ params }: { params: Params }) {
  const project = getProject(params.slug)
  if (!project) notFound()

  const index = projects.indexOf(project)
  const next = projects[(index + 1) % projects.length]
  const [primary, ...others] = project.links

  const meta = [
    { label: 'Année', value: project.year },
    { label: 'Rôle', value: project.role },
    { label: 'Client', value: project.client ?? 'Projet personnel' },
    { label: 'Statut', value: statusLabels[project.status] },
  ]

  return (
    <main className="gutter pb-32 pt-[calc(var(--header-h)+8vh)]">
      {/* En-tête */}
      <p className="enter label text-fg/50">
        {pad2(index + 1)} / {pad2(projects.length)} · {categoryLabels[project.category]}
      </p>
      <h1 className="title-xl enter mt-6 max-w-[16ch]" style={{ animationDelay: '80ms' }}>
        {project.title}
      </h1>
      <p
        className="enter mt-6 max-w-measure font-display text-xl tracking-tight text-fg/70 md:text-2xl"
        style={{ animationDelay: '160ms' }}
      >
        {project.tagline}
      </p>

      <dl
        className="enter mt-14 grid grid-cols-2 gap-8 border-t border-line pt-8 md:grid-cols-4"
        style={{ animationDelay: '240ms' }}
      >
        {meta.map((m) => (
          <div key={m.label}>
            <dt className="label text-fg/50">{m.label}</dt>
            <dd className="mt-3 text-sm md:text-base">{m.value}</dd>
          </div>
        ))}
      </dl>

      {/* Visuel */}
      {project.image && (
        <figure
          className="enter mt-16 overflow-hidden rounded-xl border border-line bg-elev"
          style={{ animationDelay: '320ms' }}
        >
          <Image
            src={project.image}
            alt={`Aperçu de ${project.title}`}
            width={1750}
            height={1000}
            priority
            sizes="(min-width: 1280px) 1200px, 100vw"
          />
        </figure>
      )}

      {/* Corps */}
      <div className="mt-20 grid gap-12 md:grid-cols-12 md:gap-8">
        <aside className="md:col-span-4 lg:col-span-3">
          {primary && (
            <a href={primary.href} target="_blank" rel="noopener noreferrer" className="btn-pill">
              <RollText>{primary.label}</RollText>
              <span aria-hidden>↗</span>
            </a>
          )}
          {others.length > 0 && (
            <ul className="mt-6 space-y-3">
              {others.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-line text-sm text-fg/70 transition-colors hover:text-fg"
                  >
                    {l.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          )}

          <p className="label mt-12 text-fg/50">Stack</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.stack.map((s) => {
              const icon = techIcon(s)
              return (
                <li
                  key={s}
                  style={icon ? ({ '--brand': `#${icon.hex}` } as React.CSSProperties) : undefined}
                  className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs text-fg/80 transition-colors duration-300 hover:border-fg/40"
                >
                  {icon && <TechIcon icon={icon} size={14} className="text-fg/70 transition-colors duration-300 group-hover:text-[color:var(--brand)]" />}
                  {s}
                </li>
              )
            })}
          </ul>
        </aside>

        <div className="md:col-span-8 md:col-start-5 lg:col-span-7 lg:col-start-6">
          <p className="max-w-measure text-lg leading-relaxed text-fg/80">{project.description}</p>

          {project.built.length > 0 && (
            <section className="mt-16">
              <h2 className="label text-fg/50">Ce que j&apos;ai construit</h2>
              <ul className="mt-6 border-t border-line">
                {project.built.map((b) => (
                  <li key={b} className="border-b border-line py-4 text-base leading-relaxed">
                    {b}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {project.results.length > 0 && (
            <section className="mt-16">
              <h2 className="label text-fg/50">Résultats</h2>
              <ul className="mt-6 grid gap-6 sm:grid-cols-2">
                {project.results.map((r) => (
                  <li key={r} className="font-mono text-sm leading-relaxed text-fg/80">
                    {r}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>

      {/* Suivant */}
      <nav aria-label="Projet suivant" className="mt-32 border-t border-line pt-10">
        <p className="label text-fg/50">Projet suivant</p>
        <Link href={`/projects/${next.slug}`} className="group mt-4 inline-flex items-baseline gap-4">
          <span className="title-xl transition-colors duration-300 group-hover:text-fg/70">{next.title}</span>
          <span aria-hidden className="text-2xl transition-transform duration-500 ease-main group-hover:translate-x-2">
            →
          </span>
        </Link>
      </nav>
    </main>
  )
}
