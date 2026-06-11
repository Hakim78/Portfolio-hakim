import type { Metadata } from 'next'
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ClientLayout } from './client-layout'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://hakim.dev'),
  title: {
    default: 'Hakim | Full-Stack & AI Developer',
    template: '%s | Hakim',
  },
  description:
    'Développeur Full-Stack & IA spécialisé dans la création de systèmes intelligents. Computer Vision, NLP, MLOps et développement web moderne.',
  keywords: [
    'Développeur Full-Stack',
    'Intelligence Artificielle',
    'Machine Learning',
    'Computer Vision',
    'NLP',
    'Python',
    'React',
    'Next.js',
    'TensorFlow',
    'PyTorch',
  ],
  authors: [{ name: 'Hakim' }],
  creator: 'Hakim',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://hakim.dev',
    siteName: 'Hakim Portfolio',
    title: 'Hakim | Full-Stack & AI Developer',
    description:
      'Développeur Full-Stack & IA spécialisé dans la création de systèmes intelligents.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Hakim - Full-Stack & AI Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hakim | Full-Stack & AI Developer',
    description:
      'Développeur Full-Stack & IA spécialisé dans la création de systèmes intelligents.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans bg-dark text-white antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
