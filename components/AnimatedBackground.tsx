'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'

export default function AnimatedBackground() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()
  const pathname = usePathname()
  const isInnerPage = pathname !== '/'
  const isDark = resolvedTheme === 'dark'

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      {/* Layer 0: Instant base — no flash ever */}
      <div
        className="fixed inset-0 -z-30 pointer-events-none"
        style={{
          background: 'var(--bg-gradient)',
          transition: 'background 0.4s ease',
        }}
      />

      {/* Layer 1: Animated orbs
          IMPORTANT: No contain:strict — it isolated blend modes against black,
          causing multiply to render as black in light mode. */}
      <div
        className="fixed inset-0 -z-20 pointer-events-none overflow-hidden"
        style={{
          opacity: mounted ? (isInnerPage ? 0.25 : 0.55) : 0,
          transition: 'opacity 1.5s ease-in-out',
          willChange: 'opacity',
          transform: 'translateZ(0)',
        }}
      >
        {/* SVG goo filter — keeps blobs soft */}
        <svg className="absolute" style={{ width: 0, height: 0 }}>
          <defs>
            <filter id="weleda-goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="30" result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 12 -4"
                result="goo"
              />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>
        </svg>

        {/* Orb container — GPU composited */}
        <div
          style={{
            position: 'absolute',
            inset: '-20%',
            filter: 'blur(60px)',
            transform: 'translate3d(0,0,0)',
            willChange: 'transform',
          }}
        >
          {/* ORB 1 — Violet — TOP LEFT
              Dark: vivid screen glow · Light: pastel multiply tint */}
          <div
            style={{
              position: 'absolute',
              top: '5vh',
              left: '5vw',
              width: '45vw',
              height: '45vw',
              maxWidth: '600px',
              maxHeight: '600px',
              borderRadius: '50%',
              background: mounted && isDark
                ? 'radial-gradient(circle at 40% 40%, rgba(140,60,255,0.85) 0%, rgba(100,20,200,0.4) 45%, transparent 70%)'
                : 'radial-gradient(circle at 40% 40%, rgba(180,120,255,0.55) 0%, rgba(160,80,240,0.2) 45%, transparent 70%)',
              mixBlendMode: mounted && isDark ? 'screen' : 'multiply',
              animation: 'orbDrift1 55s ease-in-out infinite',
              willChange: 'transform',
            }}
          />

          {/* ORB 2 — Magenta/Rose — TOP RIGHT */}
          <div
            style={{
              position: 'absolute',
              top: '0vh',
              right: '0vw',
              width: '40vw',
              height: '50vh',
              maxWidth: '550px',
              borderRadius: '50%',
              background: mounted && isDark
                ? 'radial-gradient(circle at 60% 35%, rgba(255,50,180,0.80) 0%, rgba(200,20,120,0.35) 50%, transparent 72%)'
                : 'radial-gradient(circle at 60% 35%, rgba(255,140,200,0.60) 0%, rgba(240,100,180,0.25) 50%, transparent 72%)',
              mixBlendMode: mounted && isDark ? 'screen' : 'multiply',
              animation: 'orbDrift2 70s ease-in-out infinite',
              willChange: 'transform',
            }}
          />

          {/* ORB 3 — Amber/Gold — BOTTOM LEFT */}
          <div
            style={{
              position: 'absolute',
              bottom: '5vh',
              left: '8vw',
              width: '38vw',
              height: '38vw',
              maxWidth: '480px',
              maxHeight: '480px',
              borderRadius: '50%',
              background: mounted && isDark
                ? 'radial-gradient(circle at 45% 55%, rgba(255,160,40,0.75) 0%, rgba(220,100,20,0.30) 50%, transparent 72%)'
                : 'radial-gradient(circle at 45% 55%, rgba(255,200,100,0.55) 0%, rgba(240,160,40,0.22) 50%, transparent 72%)',
              mixBlendMode: mounted && isDark ? 'screen' : 'multiply',
              animation: 'orbDrift3 65s ease-in-out infinite',
              willChange: 'transform',
            }}
          />

          {/* ORB 4 — Teal/Emerald — BOTTOM RIGHT */}
          <div
            style={{
              position: 'absolute',
              bottom: '0vh',
              right: '5vw',
              width: '42vw',
              height: '42vw',
              maxWidth: '520px',
              maxHeight: '520px',
              borderRadius: '50%',
              background: mounted && isDark
                ? 'radial-gradient(circle at 55% 60%, rgba(20,220,160,0.65) 0%, rgba(10,160,120,0.28) 50%, transparent 72%)'
                : 'radial-gradient(circle at 55% 60%, rgba(80,220,180,0.50) 0%, rgba(40,180,140,0.20) 50%, transparent 72%)',
              mixBlendMode: mounted && isDark ? 'screen' : 'multiply',
              animation: 'orbDrift4 80s ease-in-out infinite',
              willChange: 'transform',
            }}
          />

          {/* ORB 5 — Soft Rose — CENTER RIGHT */}
          <div
            style={{
              position: 'absolute',
              top: '35vh',
              right: '10vw',
              width: '35vw',
              height: '35vw',
              maxWidth: '440px',
              maxHeight: '440px',
              borderRadius: '50%',
              background: mounted && isDark
                ? 'radial-gradient(circle at 50% 50%, rgba(255,100,140,0.55) 0%, rgba(200,60,100,0.22) 50%, transparent 70%)'
                : 'radial-gradient(circle at 50% 50%, rgba(255,160,180,0.45) 0%, rgba(240,120,150,0.18) 50%, transparent 70%)',
              mixBlendMode: mounted && isDark ? 'screen' : 'multiply',
              animation: 'orbDrift5 90s ease-in-out infinite',
              willChange: 'transform',
            }}
          />

          {/* ORB 6 — Cool Indigo — CENTER LEFT */}
          <div
            style={{
              position: 'absolute',
              top: '40vh',
              left: '15vw',
              width: '30vw',
              height: '30vw',
              maxWidth: '380px',
              maxHeight: '380px',
              borderRadius: '50%',
              background: mounted && isDark
                ? 'radial-gradient(circle at 50% 50%, rgba(80,100,255,0.50) 0%, rgba(60,60,200,0.20) 50%, transparent 70%)'
                : 'radial-gradient(circle at 50% 50%, rgba(140,160,255,0.45) 0%, rgba(100,100,240,0.18) 50%, transparent 70%)',
              mixBlendMode: mounted && isDark ? 'screen' : 'multiply',
              animation: 'orbDrift6 75s ease-in-out infinite',
              willChange: 'transform',
            }}
          />
        </div>
      </div>

      {/* Layer 2: Inner page reading scrim — uses CSS var so it's correct on SSR */}
      {isInnerPage && (
        <div
          className="fixed inset-0 -z-10 pointer-events-none"
          style={{ background: 'var(--bg-inner-scrim)' }}
        />
      )}
    </>
  )
}
