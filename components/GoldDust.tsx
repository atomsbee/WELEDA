'use client'
import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'

const HUES = [42, 50, 270, 320, 162, 200, 35, 300]

interface Mote {
  x: number; y: number
  radius: number
  speedY: number
  speedX: number
  opacity: number
  twinkle: number
  twinkleSpeed: number
  hue: number
  life: number
  lifeSpeed: number
}

function spawnMote(w: number, h: number, spread = false): Mote {
  return {
    x:            Math.random() * w,
    y:            spread ? Math.random() * h : h + 5,
    radius:       0.4 + Math.random() * 1.5,
    speedY:       -(0.08 + Math.random() * 0.22),
    speedX:       (Math.random() - 0.5) * 0.12,
    opacity:      0.25 + Math.random() * 0.4,
    twinkle:      Math.random() * Math.PI * 2,
    twinkleSpeed: 0.015 + Math.random() * 0.04,
    hue:          HUES[Math.floor(Math.random() * HUES.length)],
    life:         spread ? Math.random() * 0.7 : 0,
    lifeSpeed:    0.0003 + Math.random() * 0.0005,
  }
}

export default function GoldDust() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const motes     = useRef<Mote[]>([])
  const animRef   = useRef<number>(0)
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted || resolvedTheme !== 'dark') return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const MAX = window.innerWidth < 768 ? 40 : 80

    for (let i = 0; i < Math.round(MAX * 0.85); i++) {
      motes.current.push(spawnMote(canvas.width, canvas.height, true))
    }

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = motes.current.length - 1; i >= 0; i--) {
        const m = motes.current[i]

        m.x       += m.speedX
        m.y       += m.speedY
        m.twinkle += m.twinkleSpeed
        m.life    += m.lifeSpeed

        m.speedX += (Math.random() - 0.5) * 0.003
        m.speedX  = Math.max(-0.18, Math.min(0.18, m.speedX))

        if (m.y < -5 || m.life >= 1) {
          motes.current.splice(i, 1)
          continue
        }

        const fade   = Math.min(m.life * 8, 1) * Math.min((1 - m.life) * 6, 1)
        const twinkA = 0.5 + 0.5 * Math.sin(m.twinkle)
        const alpha  = m.opacity * fade * twinkA

        if (alpha < 0.02) continue

        // Soft glow halo for larger motes
        if (m.radius > 1.2) {
          const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.radius * 4)
          g.addColorStop(0, `hsla(${m.hue}, 80%, 75%, ${alpha * 0.35})`)
          g.addColorStop(1, 'rgba(0,0,0,0)')
          ctx.beginPath()
          ctx.arc(m.x, m.y, m.radius * 4, 0, Math.PI * 2)
          ctx.fillStyle = g
          ctx.fill()
        }

        // Core dot
        ctx.beginPath()
        ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${m.hue}, 85%, 80%, ${alpha})`
        ctx.fill()
      }

      if (motes.current.length < MAX && Math.random() < 0.08) {
        motes.current.push(spawnMote(canvas.width, canvas.height))
      }

      animRef.current = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
      motes.current = []
    }
  }, [mounted, resolvedTheme])

  if (!mounted) return <div className="fixed inset-0 pointer-events-none" aria-hidden="true" />
  if (resolvedTheme !== 'dark') return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex:     -14,
        opacity:    0.9,
        transform:  'translateZ(0)',
        willChange: 'transform',
      }}
    />
  )
}
