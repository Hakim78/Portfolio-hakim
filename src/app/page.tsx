import { Hero } from '@/components/hero/Hero'
import { Intro } from '@/components/sections/Intro'
import { WorkStrip } from '@/components/work/WorkStrip'
import { ProjectGrid } from '@/components/work/ProjectGrid'
import { Experience } from '@/components/sections/Experience'
import { Skills } from '@/components/sections/Skills'
import { Contact } from '@/components/contact/Contact'
import { featuredProjects, projects } from '@/data/projects'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Intro />
      <section id="projets" aria-label="Projets" className="scroll-mt-[var(--header-h)]">
        <WorkStrip projects={featuredProjects} />
        <ProjectGrid projects={projects} />
      </section>
      <Experience />
      <Skills />
      <Contact />
    </main>
  )
}
