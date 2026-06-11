'use client'

import { ReactNode, Suspense, lazy } from 'react'
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider'
import { GSAPProvider } from '@/components/providers/GSAPProvider'
import { Navigation } from '@/components/ui/Navigation'
import { Footer } from '@/components/ui/Footer'

// Lazy load the heavy 3D background
const CyberneticBackground = lazy(() =>
  import('@/components/three/CyberneticBackground').then((mod) => ({
    default: mod.CyberneticBackground,
  }))
)

interface ClientLayoutProps {
  children: ReactNode
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <SmoothScrollProvider>
      <GSAPProvider>
        {/* Cybernetic 3D Background */}
        <Suspense fallback={null}>
          <CyberneticBackground />
        </Suspense>

        {/* Main content */}
        <div className="relative z-10">
          <Navigation />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </div>
      </GSAPProvider>
    </SmoothScrollProvider>
  )
}
