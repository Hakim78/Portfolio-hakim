import type { Metadata } from 'next'
import { ProjectIndex } from '@/components/work/ProjectIndex'
import { projects } from '@/data/projects'

export const metadata: Metadata = {
  title: 'Index',
  description: 'Tous les projets : IA, produit web, mobile, data.',
}

export default function ProjectsPage() {
  return (
    <main className="gutter pb-32 pt-[calc(var(--header-h)+8vh)]">
      <div className="enter flex flex-wrap items-end justify-between gap-6">
        <h1 className="title-xl">Index</h1>
        <p className="label pb-2 text-fg/50">{projects.length} projets · 2023 — {new Date().getFullYear()}</p>
      </div>
      <ProjectIndex projects={projects} />
    </main>
  )
}
