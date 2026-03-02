'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function PublicHeader() {
  const pathname = usePathname()

  // Hide on all admin routes
  if (pathname?.startsWith('/admin')) return null

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40"
      style={{
        background: 'var(--bg-nav)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-nav)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Logo */}
        <Link href="/" aria-label="WELEDA home" className="flex-shrink-0">
          <Image
            src="/img/weleda-logo-white.svg"
            alt="WELEDA"
            width={100}
            height={32}
            className="w-[100px] sm:w-[120px] weleda-logo"
            priority
          />
        </Link>

        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <ThemeToggle />

          {/* Vote Now CTA — hidden on mobile */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="hidden sm:block relative overflow-hidden rounded-full"
          >
            <Link
              href="/#influencer-grid"
              className="relative block px-5 py-2 text-sm font-bold rounded-full"
              style={{
                background: 'linear-gradient(135deg, #B478FF 0%, #FFD700 0%, #FF6EB4 66%, #B478FF 100%)',
                boxShadow: '0 4px 20px rgba(180,120,255,0.35)',
                color: '#ffffff',
              }}
            >
              {/* Shimmer sweep */}
              <span
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  background:
                    'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)',
                  animation: 'shimmerSweep 2.8s ease infinite',
                }}
              />
              <span className="relative z-10">JETZT ABSTIMMEN</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </header>
  )
}
