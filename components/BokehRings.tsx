'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const RINGS = [
  // Outline rings (iridescent borders)
  { size: 44,  left: '6%',  delay: '0s',   dur: '18s', color: 'rgba(180,120,255,0.30)', filled: false },
  { size: 22,  left: '16%', delay: '4.5s', dur: '23s', color: 'rgba(255,100,180,0.35)', filled: false },
  { size: 68,  left: '26%', delay: '9s',   dur: '28s', color: 'rgba(255,185,55,0.22)',  filled: false },
  { size: 16,  left: '35%', delay: '1.5s', dur: '20s', color: 'rgba(60,220,180,0.28)',  filled: false },
  { size: 52,  left: '47%', delay: '6s',   dur: '25s', color: 'rgba(180,120,255,0.24)', filled: false },
  { size: 32,  left: '58%', delay: '11s',  dur: '21s', color: 'rgba(255,100,180,0.32)', filled: false },
  { size: 78,  left: '68%', delay: '2.5s', dur: '30s', color: 'rgba(255,185,55,0.18)',  filled: false },
  { size: 26,  left: '77%', delay: '7.5s', dur: '22s', color: 'rgba(60,220,180,0.25)',  filled: false },
  { size: 48,  left: '86%', delay: '13s',  dur: '26s', color: 'rgba(180,120,255,0.20)', filled: false },
  { size: 19,  left: '93%', delay: '3.5s', dur: '19s', color: 'rgba(255,255,255,0.18)', filled: false },
  { size: 36,  left: '11%', delay: '14s',  dur: '24s', color: 'rgba(255,100,180,0.22)', filled: false },
  { size: 58,  left: '42%', delay: '8s',   dur: '27s', color: 'rgba(60,220,180,0.20)',  filled: false },
  { size: 24,  left: '72%', delay: '16s',  dur: '21s', color: 'rgba(180,120,255,0.26)', filled: false },
  { size: 14,  left: '88%', delay: '5s',   dur: '17s', color: 'rgba(255,185,55,0.30)',  filled: false },
  // Filled soft bokeh glow dots
  { size: 9,   left: '13%', delay: '10s',  dur: '26s', color: 'rgba(180,120,255,0.55)', filled: true  },
  { size: 6,   left: '33%', delay: '15s',  dur: '22s', color: 'rgba(255,100,180,0.55)', filled: true  },
  { size: 11,  left: '54%', delay: '3s',   dur: '24s', color: 'rgba(255,200,70,0.48)',  filled: true  },
  { size: 7,   left: '74%', delay: '18s',  dur: '20s', color: 'rgba(60,220,180,0.52)',  filled: true  },
  { size: 5,   left: '91%', delay: '8s',   dur: '18s', color: 'rgba(255,255,255,0.45)', filled: true  },
  { size: 8,   left: '22%', delay: '20s',  dur: '23s', color: 'rgba(255,100,180,0.48)', filled: true  },
  { size: 10,  left: '63%', delay: '12s',  dur: '25s', color: 'rgba(180,120,255,0.45)', filled: true  },
  { size: 6,   left: '80%', delay: '6s',   dur: '19s', color: 'rgba(255,200,70,0.50)',  filled: true  },
]

export default function BokehRings() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (!mounted || resolvedTheme !== 'dark') return null

  return (
    <div
      className="bokeh-el fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: -16 }}
      aria-hidden="true"
    >
      {RINGS.map((r, i) => (
        <div
          key={i}
          className="bokeh-el absolute rounded-full"
          style={{
            width:      r.size,
            height:     r.size,
            left:       r.left,
            bottom:     `-${r.size + 10}px`,
            border:     r.filled ? 'none' : `1px solid ${r.color}`,
            background: r.filled
              ? `radial-gradient(circle at 35% 35%, ${r.color} 0%, transparent 70%)`
              : `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.06) 0%, transparent 60%)`,
            filter:     r.filled
              ? `blur(${Math.round(r.size * 0.25)}px)`
              : 'blur(0.8px)',
            boxShadow:  r.filled
              ? 'none'
              : `inset 0 0 ${Math.round(r.size * 0.3)}px rgba(255,255,255,0.04)`,
            animation:  `bokehFloat ${r.dur} ${r.delay} linear infinite`,
          }}
        />
      ))}
    </div>
  )
}
