'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const RIBBONS = [
  // Brand violet — Mystic Aura
  {
    left: '-5%', width: '28%',
    top: '-20%', height: '140%',
    gradient: 'linear-gradient(180deg, transparent 0%, rgba(140,60,255,0.0) 10%, rgba(140,60,255,0.13) 30%, rgba(100,20,220,0.15) 55%, rgba(160,80,255,0.08) 75%, transparent 100%)',
    animation: 'auroraWave1 18s ease-in-out infinite',
    delay: '0s',
  },
  // Hot pink — campaign accent
  {
    left: '12%', width: '22%',
    top: '-20%', height: '140%',
    gradient: 'linear-gradient(180deg, transparent 0%, rgba(255,60,180,0.0) 15%, rgba(255,60,180,0.10) 35%, rgba(220,20,140,0.13) 60%, rgba(255,100,180,0.06) 80%, transparent 100%)',
    animation: 'auroraWave2 24s ease-in-out infinite',
    delay: '3s',
  },
  // Deep indigo — depth layer
  {
    left: '28%', width: '18%',
    top: '-20%', height: '140%',
    gradient: 'linear-gradient(180deg, transparent 0%, rgba(60,40,200,0.0) 20%, rgba(60,40,200,0.07) 40%, rgba(40,20,180,0.10) 65%, transparent 100%)',
    animation: 'auroraWave3 30s ease-in-out infinite',
    delay: '7s',
  },
  // Warm gold — Vanilla Cloud
  {
    left: '58%', width: '24%',
    top: '-20%', height: '140%',
    gradient: 'linear-gradient(180deg, transparent 0%, rgba(255,170,40,0.0) 10%, rgba(255,170,40,0.08) 30%, rgba(220,130,20,0.11) 58%, rgba(255,180,60,0.06) 78%, transparent 100%)',
    animation: 'auroraWave1 22s ease-in-out infinite',
    delay: '5s',
  },
  // Teal — Tropical Crush
  {
    left: '72%', width: '20%',
    top: '-20%', height: '140%',
    gradient: 'linear-gradient(180deg, transparent 0%, rgba(20,200,160,0.0) 15%, rgba(20,200,160,0.08) 38%, rgba(10,160,130,0.11) 62%, rgba(40,210,170,0.06) 80%, transparent 100%)',
    animation: 'auroraWave2 26s ease-in-out infinite',
    delay: '9s',
  },
  // Rose — right edge
  {
    left: '85%', width: '22%',
    top: '-20%', height: '140%',
    gradient: 'linear-gradient(180deg, transparent 0%, rgba(255,100,140,0.0) 12%, rgba(255,100,140,0.07) 35%, rgba(220,60,110,0.10) 60%, transparent 100%)',
    animation: 'auroraWave3 20s ease-in-out infinite',
    delay: '12s',
  },
]

export default function AuroraCurtain() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (!mounted || resolvedTheme !== 'dark') return null

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: -15 }}
      aria-hidden="true"
    >
      {/* Horizontal shimmer scan lines */}
      <div
        style={{
          position: 'absolute',
          top: '35%', left: '-10%',
          width: '120%', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(180,120,255,0.11), rgba(255,100,180,0.08), rgba(20,200,160,0.07), transparent)',
          animation: 'auroraShimmer 8s ease-in-out infinite',
          filter: 'blur(2px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '65%', left: '-10%',
          width: '120%', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,170,40,0.07), rgba(180,120,255,0.08), transparent)',
          animation: 'auroraShimmer 12s ease-in-out infinite',
          animationDelay: '4s',
          filter: 'blur(2px)',
        }}
      />

      {/* Vertical light ribbons */}
      {RIBBONS.map((r, i) => (
        <div
          key={i}
          style={{
            position:   'absolute',
            left:       r.left,
            top:        r.top,
            width:      r.width,
            height:     r.height,
            background: r.gradient,
            animation:  r.animation,
            animationDelay: r.delay,
            filter:     'blur(50px)',
            mixBlendMode: 'screen',
            willChange: 'transform, opacity',
            transform:  'translateZ(0)',
          }}
        />
      ))}
    </div>
  )
}
