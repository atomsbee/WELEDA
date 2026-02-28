import type { Metadata } from 'next'
import './globals.css'
import CookieBanner from '@/components/CookieBanner'
import Footer from '@/components/Footer'
import PageTransition from '@/components/PageTransition'
import AnimatedBackground from '@/components/AnimatedBackground'
import BokehRings from '@/components/BokehRings'
import BubbleCanvas from '@/components/BubbleCanvas'
import PublicHeader from '@/components/PublicHeader'
import { ThemeProvider } from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: "WELEDA Community Voting – Vote for the Next WELEDA Creator",
  description:
    'Cast your vote for your favourite creator and decide who becomes the next face of WELEDA. Community Voting 2026.',
  keywords: [
    'WELEDA',
    'Influencer Voting',
    'Community Vote',
    'Natural Beauty',
    'Creator',
    'Vote',
  ],
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: "WELEDA's Next Creator – Community Voting",
    description: 'Cast your vote for your favourite creator and help choose the next face of WELEDA.',
    images: [
      {
        url: '/weleda-logo.svg',
        width: 1200,
        height: 630,
        alt: 'WELEDA Community Voting',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "WELEDA's Next Creator – Community Voting",
    description: 'Cast your vote for your favourite creator and help choose the next face of WELEDA.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: import('react').ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider>
          {/* Immediate base — always visible, prevents flash */}
          <div
            className="fixed inset-0 -z-20"
            style={{ background: 'var(--bg-gradient)' }}
          />
          {/* z-20: slow color orbs */}
          <AnimatedBackground />
          {/* z-16: bokeh rings — CSS only, zero JS cost, dark mode only */}
          <BokehRings />
          {/* z-15: interactive soap bubbles — canvas, dark mode only */}
          <BubbleCanvas />
          <PublicHeader />
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  )
}
