'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

/*
  Each petal is coloured to match one of the 3 fragrance categories:
  Vanilla Cloud  → warm cream / peach / blush
  Mystic Aura    → soft lilac / violet / lavender
  Tropical Crush → fresh mint / coral / soft orange
*/

const PETALS = [
  // ── VANILLA CLOUD — warm cream / peach ──
  {
    w: 18, h: 26, left: '4%',
    delay: '0s', dur: '24s',
    color: 'rgba(255,215,170,0.60)',
    drift: '28px', spin: '130deg',
    rx: '58% 42% 52% 48% / 62% 38% 62% 38%',
    shadow: 'rgba(255,180,120,0.20)',
  },
  {
    w: 13, h: 19, left: '17%',
    delay: '7s', dur: '29s',
    color: 'rgba(255,200,155,0.50)',
    drift: '-22px', spin: '210deg',
    rx: '50% 50% 46% 54% / 56% 44% 58% 42%',
    shadow: 'rgba(255,170,110,0.15)',
  },
  {
    w: 22, h: 31, left: '31%',
    delay: '14s', dur: '22s',
    color: 'rgba(255,225,180,0.55)',
    drift: '34px', spin: '165deg',
    rx: '62% 38% 56% 44% / 52% 48% 46% 54%',
    shadow: 'rgba(255,190,130,0.18)',
  },
  {
    w: 11, h: 16, left: '62%',
    delay: '4s', dur: '31s',
    color: 'rgba(255,205,160,0.45)',
    drift: '-18px', spin: '250deg',
    rx: '46% 54% 52% 48% / 48% 52% 62% 38%',
    shadow: 'rgba(255,175,115,0.12)',
  },
  {
    w: 16, h: 23, left: '79%',
    delay: '19s', dur: '26s',
    color: 'rgba(255,220,175,0.52)',
    drift: '22px', spin: '190deg',
    rx: '54% 46% 50% 50% / 58% 42% 54% 46%',
    shadow: 'rgba(255,185,125,0.16)',
  },

  // ── MYSTIC AURA — lilac / violet / lavender ──
  {
    w: 17, h: 25, left: '11%',
    delay: '10s', dur: '27s',
    color: 'rgba(205,165,255,0.55)',
    drift: '25px', spin: '185deg',
    rx: '56% 44% 50% 50% / 60% 40% 60% 40%',
    shadow: 'rgba(160,100,240,0.15)',
  },
  {
    w: 21, h: 29, left: '44%',
    delay: '2s', dur: '23s',
    color: 'rgba(185,135,255,0.48)',
    drift: '-30px', spin: '310deg',
    rx: '50% 50% 56% 44% / 54% 46% 52% 48%',
    shadow: 'rgba(140,80,230,0.14)',
  },
  {
    w: 14, h: 20, left: '58%',
    delay: '16s', dur: '33s',
    color: 'rgba(215,175,255,0.45)',
    drift: '18px', spin: '145deg',
    rx: '48% 52% 52% 48% / 62% 38% 56% 44%',
    shadow: 'rgba(170,110,250,0.12)',
  },
  {
    w: 19, h: 27, left: '85%',
    delay: '5s', dur: '25s',
    color: 'rgba(195,150,255,0.52)',
    drift: '-24px', spin: '225deg',
    rx: '54% 46% 48% 52% / 46% 54% 60% 40%',
    shadow: 'rgba(155,95,240,0.16)',
  },
  {
    w: 12, h: 17, left: '93%',
    delay: '21s', dur: '20s',
    color: 'rgba(210,170,255,0.42)',
    drift: '15px', spin: '275deg',
    rx: '52% 48% 54% 46% / 58% 42% 50% 50%',
    shadow: 'rgba(165,105,245,0.11)',
  },

  // ── TROPICAL CRUSH — mint / coral / soft orange ──
  {
    w: 16, h: 23, left: '24%',
    delay: '8s', dur: '26s',
    color: 'rgba(120,225,185,0.50)',
    drift: '26px', spin: '200deg',
    rx: '52% 48% 54% 46% / 57% 43% 54% 46%',
    shadow: 'rgba(40,190,140,0.14)',
  },
  {
    w: 20, h: 28, left: '49%',
    delay: '18s', dur: '30s',
    color: 'rgba(255,155,125,0.48)',
    drift: '-27px', spin: '280deg',
    rx: '56% 44% 52% 48% / 50% 50% 56% 44%',
    shadow: 'rgba(240,100,70,0.13)',
  },
  {
    w: 12, h: 18, left: '72%',
    delay: '3s', dur: '24s',
    color: 'rgba(100,215,175,0.45)',
    drift: '20px', spin: '155deg',
    rx: '50% 50% 48% 52% / 60% 40% 52% 48%',
    shadow: 'rgba(30,180,130,0.12)',
  },
  {
    w: 18, h: 26, left: '88%',
    delay: '13s', dur: '28s',
    color: 'rgba(255,165,135,0.45)',
    drift: '-16px', spin: '320deg',
    rx: '48% 52% 56% 44% / 55% 45% 48% 52%',
    shadow: 'rgba(235,90,60,0.12)',
  },

  // ── EXTRAS — soft white / blush ──
  {
    w: 24, h: 33, left: '37%',
    delay: '11s', dur: '35s',
    color: 'rgba(255,240,230,0.55)',
    drift: '32px', spin: '175deg',
    rx: '55% 45% 50% 50% / 58% 42% 56% 44%',
    shadow: 'rgba(255,210,185,0.18)',
  },
  {
    w: 10, h: 15, left: '7%',
    delay: '25s', dur: '22s',
    color: 'rgba(240,215,255,0.50)',
    drift: '-14px', spin: '260deg',
    rx: '50% 50% 52% 48% / 55% 45% 60% 40%',
    shadow: 'rgba(200,160,255,0.14)',
  },
]

export default function FloatingPetals() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return <div className="fixed inset-0 pointer-events-none" aria-hidden="true" />
  if (resolvedTheme !== 'light') return null

  return (
    <div
      className="petal-el fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: -17 }}
      aria-hidden="true"
    >
      {PETALS.map((p, i) => (
        <div
          key={i}
          className="petal-el absolute"
          style={{
            width:  p.w,
            height: p.h,
            left:   p.left,
            top:    '-40px',
            background:   p.color,
            borderRadius: p.rx,
            '--petal-drift': p.drift,
            '--petal-spin':  p.spin,
            animation: `petalFall ${p.dur} ${p.delay} ease-in infinite`,
            boxShadow: `
              0 3px 10px ${p.shadow},
              inset 0 1px 3px rgba(255,255,255,0.65),
              inset 0 -1px 2px rgba(0,0,0,0.04)
            `,
            backdropFilter: 'blur(1.5px)',
            WebkitBackdropFilter: 'blur(1.5px)',
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}
