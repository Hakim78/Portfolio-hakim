import { WorkStrip } from '@/components/work/WorkStrip'
import { Profile } from '@/components/sections/Profile'
import NovaAssistant from '@/components/nova/NovaAssistant'
import { featuredProjects } from '@/data/projects'

export default function HomePage() {
  return (
    <main>
      <WorkStrip projects={featuredProjects} />
      <Profile />
      <NovaAssistant id="contact" theme="dark" endpoint="/api/contact" />
    </main>
  )
}
