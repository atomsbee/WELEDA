import type { Metadata } from 'next'
import './globals.css'
import PublicShell from '@/components/PublicShell'

export const metadata: Metadata = {
  title: 'Weleda® Sommerkampagne 2026',
  description:
    'Vote für deinen Favoriten! Die Community wählt 3 neue Gesichter der Weleda Fragrance Body & Hair Mist Campaign. Voting-Phase: 13.–17. März 2026.',
  keywords: [
    'Weleda',
    'Summer Campaign',
    'Casting',
    'Vote',
    'Fragrance',
    'Body Mist',
    'Hair Mist',
    'Community Vote',
    'Teneriffa',
    '#weledacasting',
  ],
  icons: {
    icon: [
      { url: '/img/favicon.ico' },
      { url: '/img/favicon.svg', type: 'image/svg+xml' },
      { url: '/img/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: '/img/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Weleda® Sommerkampagne 2026',
    description: 'Wähle die 3 neuen Gesichter der WELEDA Fragrance Campaign. Jetzt voten!',
    images: [
      {
        url: '/img/weleda-logo.svg',
        width: 1200,
        height: 630,
        alt: 'Weleda® Community Voting',
      },
    ],
    locale: 'de_DE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Weleda® Sommerkampagne 2026',
    description: 'Wähle die 3 neuen Gesichter der WELEDA Fragrance Campaign. Jetzt voten!',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: import('react').ReactNode }) {
  return (
    <html lang="en" className="light">
      <body className="min-h-screen flex flex-col antialiased">
        {/* Instant base gradient — eliminates flash on load */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: -30, background: 'var(--bg-gradient)' }}
        />
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  )
}
