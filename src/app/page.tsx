import { HeroSection } from '@/components/sections/HeroSection'
import { FeaturedProjects } from '@/components/sections/FeaturedProjects'
import { SkillsSection } from '@/components/sections/SkillsSection'
import { ContactCTA } from '@/components/sections/ContactCTA'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProjects />
      <SkillsSection />
      <ContactCTA />
    </>
  )
}
