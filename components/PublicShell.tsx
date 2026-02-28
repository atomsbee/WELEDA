'use client'

import { usePathname } from 'next/navigation'
import AnimatedBackground from './AnimatedBackground'
import FloatingPetals from './FloatingPetals'
import MistDroplets from './MistDroplets'
import AuroraCurtain from './AuroraCurtain'
import GoldDust from './GoldDust'
import PublicHeader from './PublicHeader'
import Footer from './Footer'
import CookieBanner from './CookieBanner'
import PageTransition from './PageTransition'

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) return <>{children}</>
  return (
    <>
      <AnimatedBackground />
      <FloatingPetals />
      <MistDroplets />
      <AuroraCurtain />
      <GoldDust />
      <PublicHeader />
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <CookieBanner />
    </>
  )
}
