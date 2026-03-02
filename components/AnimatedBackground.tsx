'use client'

import { usePathname } from 'next/navigation'

export default function AnimatedBackground() {
  const pathname = usePathname()
  const isInnerPage = pathname !== '/'

  return (
    <>
      {/* Layer 0: Base page background — instant, no flash */}
      <div
        className="fixed inset-0 -z-30 pointer-events-none"
        style={{
          background: 'var(--bg-gradient)',
          transition: 'background 0.4s ease',
        }}
      />

      {/* ── Animated CSS orbs — GPU composited, no canvas ──
          IMPORTANT: No contain:strict — it isolated blend modes against black,
          causing multiply to render as black in light mode. */}
      <div
        className="fixed inset-0 -z-20 pointer-events-none overflow-hidden"
        style={{
          opacity: isInnerPage ? 0.25 : 0.55,
          transition: 'opacity 1.5s ease-in-out',
          willChange: 'opacity',
          transform: 'translateZ(0)',
        }}
        aria-hidden="true"
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
          }}
        >
          {/* Orb 1 — Violet — top left */}
          <div style={{
            position: 'absolute', top: '5vh', left: '5vw',
            width: '45vw', height: '45vw', maxWidth: '600px', maxHeight: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 40% 40%, rgba(180,120,255,0.55) 0%, rgba(160,80,240,0.2) 45%, transparent 70%)',
            mixBlendMode: 'multiply',
          }} />
          {/* Orb 2 — Magenta — top right */}
          <div style={{
            position: 'absolute', top: '0vh', right: '0vw',
            width: '40vw', height: '50vh', maxWidth: '550px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 60% 35%, rgba(255,140,200,0.60) 0%, rgba(240,100,180,0.25) 50%, transparent 72%)',
            mixBlendMode: 'multiply',
          }} />
          {/* Orb 3 — Amber — bottom left */}
          <div style={{
            position: 'absolute', bottom: '5vh', left: '8vw',
            width: '38vw', height: '38vw', maxWidth: '480px', maxHeight: '480px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 45% 55%, rgba(255,200,100,0.55) 0%, rgba(240,160,40,0.22) 50%, transparent 72%)',
            mixBlendMode: 'multiply',
          }} />
          {/* Orb 4 — Teal — bottom right */}
          <div style={{
            position: 'absolute', bottom: '0vh', right: '5vw',
            width: '42vw', height: '42vw', maxWidth: '520px', maxHeight: '520px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 55% 60%, rgba(80,220,180,0.50) 0%, rgba(40,180,140,0.20) 50%, transparent 72%)',
            mixBlendMode: 'multiply',
          }} />
          {/* Orb 5 — Rose — center right */}
          <div style={{
            position: 'absolute', top: '35vh', right: '10vw',
            width: '35vw', height: '35vw', maxWidth: '440px', maxHeight: '440px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 50% 50%, rgba(255,160,180,0.45) 0%, rgba(240,120,150,0.18) 50%, transparent 70%)',
            mixBlendMode: 'multiply',
          }} />
          {/* Orb 6 — Indigo — center left */}
          <div style={{
            position: 'absolute', top: '40vh', left: '15vw',
            width: '30vw', height: '30vw', maxWidth: '380px', maxHeight: '380px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 50% 50%, rgba(140,160,255,0.45) 0%, rgba(100,100,240,0.18) 50%, transparent 70%)',
            mixBlendMode: 'multiply',
          }} />
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
