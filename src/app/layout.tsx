import type { Metadata, Viewport } from 'next'
import { Inter, Inter_Tight, JetBrains_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { Providers } from './providers'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { site } from '@/data/site'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-inter-tight',
  display: 'swap',
  weight: ['400', '500', '700'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  weight: ['400', '500'],
})

const title = `${site.name} — ${site.role}`

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [
    'AI Engineer',
    'ingénieur IA',
    'machine learning',
    'deep learning',
    'computer vision',
    'LLM',
    'data engineer',
    'full-stack',
    'Python',
    'PyTorch',
    'Next.js',
    'Flutter',
    'portfolio',
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  verification: { google: site.analytics.googleVerification },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: site.url,
    siteName: site.name,
    title,
    description: site.description,
    images: [{ url: '/projects/cancer-pathologies.jpg', width: 1750, height: 1000, alt: site.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description: site.description,
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  jobTitle: site.role,
  description: site.description,
  url: site.url,
  email: `mailto:${site.email}`,
  address: { '@type': 'PostalAddress', addressRegion: site.location, addressCountry: 'FR' },
  sameAs: [site.links.github, site.links.linkedin, site.links.huggingface],
  knowsAbout: ['Machine Learning', 'Deep Learning', 'Computer Vision', 'LLM', 'Python', 'PyTorch', 'TensorFlow', 'Next.js', 'Flutter', 'Data Engineering'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { ga, clarity } = site.analytics
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${interTight.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Providers>
          <Header />
          {/* La page passe au-dessus du footer fixe et le révèle en fin de défilement */}
          <div className="relative z-10 bg-bg" style={{ marginBottom: 'var(--footer-h, 0px)' }}>
            {children}
          </div>
          <Footer />
        </Providers>

        {/* Google Analytics 4 */}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="afterInteractive" />
        <Script id="ga4" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga}');`}
        </Script>
        {/* Microsoft Clarity */}
        <Script id="clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarity}");`}
        </Script>
      </body>
    </html>
  )
}
