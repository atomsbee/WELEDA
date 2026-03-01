'use client'
import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'

const BRAND_HUES = [270, 320, 42, 162, 200, 340, 30]

interface Drop {
  x: number
  y: number
  rx: number
  ry: number
  speedX: number
  speedY: number
  life: number
  lifeSpeed: number
  hue: number
  wobble: number
  wobbleSpeed: number
  sparkle: number
  sparkleSpeed: number
}

function spawnDrop(w: number, h: number, spread = false): Drop {
  const base = 1.5 + Math.random() * 6
  return {
    x:            Math.random() * w,
    y:            spread ? Math.random() * h : -15,
    rx:           base,
    ry:           base * (1.08 + Math.random() * 0.35),
    speedX:       (Math.random() - 0.5) * 0.22,
    speedY:       0.15 + Math.random() * 0.35,
    life:         spread ? Math.random() * 0.6 : 0,
    lifeSpeed:    0.0004 + Math.random() * 0.0007,
    hue:          BRAND_HUES[Math.floor(Math.random() * BRAND_HUES.length)],
    wobble:       Math.random() * Math.PI * 2,
    wobbleSpeed:  0.005 + Math.random() * 0.012,
    sparkle:      Math.random() * Math.PI * 2,
    sparkleSpeed: 0.018 + Math.random() * 0.035,
  }
}

function drawDrop(ctx: CanvasRenderingContext2D, d: Drop) {
  const fadeIn  = Math.min(d.life * 10, 1)
  const fadeOut = Math.min((1 - d.life) * 8, 1)
  const alpha   = fadeIn * fadeOut
  if (alpha < 0.01) return

  const wx = d.x + Math.sin(d.wobble) * 2

  ctx.save()

  // 1. Micro outer glow — barely visible hint of colour
  const glowR = d.rx * 4
  const glow  = ctx.createRadialGradient(wx, d.y, 0, wx, d.y, glowR)
  glow.addColorStop(0, `hsla(${d.hue}, 55%, 80%, ${0.10 * alpha})`)
  glow.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.beginPath()
  ctx.ellipse(wx, d.y, glowR, glowR * 1.1, 0, 0, Math.PI * 2)
  ctx.fillStyle = glow
  ctx.fill()

  // 2. Droplet body — pearl white, very delicate
  const body = ctx.createRadialGradient(
    wx - d.rx * 0.22, d.y - d.ry * 0.28, 0,
    wx, d.y, Math.max(d.rx, d.ry) * 1.1
  )
  body.addColorStop(0,    `rgba(255,255,255,${0.70 * alpha})`)
  body.addColorStop(0.40, `hsla(${d.hue}, 35%, 94%, ${0.35 * alpha})`)
  body.addColorStop(0.80, `hsla(${d.hue}, 45%, 90%, ${0.12 * alpha})`)
  body.addColorStop(1,    'rgba(255,255,255,0)')
  ctx.beginPath()
  ctx.ellipse(wx, d.y, d.rx, d.ry, 0, 0, Math.PI * 2)
  ctx.fillStyle = body
  ctx.fill()

  // 3. Delicate rim — faint brand colour
  ctx.beginPath()
  ctx.ellipse(wx, d.y, d.rx, d.ry, 0, 0, Math.PI * 2)
  ctx.strokeStyle = `hsla(${d.hue}, 60%, 72%, ${0.40 * alpha})`
  ctx.lineWidth   = 0.6
  ctx.stroke()

  // 4. Pulsing specular sparkle — the "dewdrop in sunlight" effect
  d.sparkle += d.sparkleSpeed
  const sparkIntensity = 0.65 + 0.35 * Math.sin(d.sparkle)
  const specSize = d.rx * 0.32

  const spec = ctx.createRadialGradient(
    wx - d.rx * 0.25, d.y - d.ry * 0.30, 0,
    wx - d.rx * 0.25, d.y - d.ry * 0.30, specSize
  )
  spec.addColorStop(0, `rgba(255,255,255,${sparkIntensity * alpha})`)
  spec.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.beginPath()
  ctx.arc(wx - d.rx * 0.25, d.y - d.ry * 0.30, specSize, 0, Math.PI * 2)
  ctx.fillStyle = spec
  ctx.fill()

  // 5. Tiny secondary catchlight — bottom right
  if (d.rx > 3) {
    ctx.beginPath()
    ctx.arc(
      wx + d.rx * 0.30, d.y + d.ry * 0.22,
      d.rx * 0.15, 0, Math.PI * 2
    )
    ctx.fillStyle = `rgba(255,255,255,${0.22 * alpha})`
    ctx.fill()
  }

  ctx.restore()
}

export default function MistDroplets() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drops     = useRef<Drop[]>([])
  const animRef   = useRef<number>(0)
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted || resolvedTheme !== 'light') return

    // Respect prefers-reduced-motion
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

    const MAX = window.innerWidth < 768 ? 30 : 55

    for (let i = 0; i < Math.round(MAX * 0.8); i++) {
      drops.current.push(spawnDrop(canvas.width, canvas.height, true))
    }

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = drops.current.length - 1; i >= 0; i--) {
        const d = drops.current[i]

        d.x      += d.speedX
        d.y      += d.speedY
        d.wobble += d.wobbleSpeed
        d.life   += d.lifeSpeed

        d.speedX += (Math.random() - 0.5) * 0.006
        d.speedX  = Math.max(-0.35, Math.min(0.35, d.speedX))

        if (d.y > canvas.height + 20 || d.life >= 1) {
          drops.current.splice(i, 1)
          continue
        }

        drawDrop(ctx, d)
      }

      if (drops.current.length < MAX && Math.random() < 0.04) {
        drops.current.push(spawnDrop(canvas.width, canvas.height))
      }

      animRef.current = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
      drops.current = []
    }
  }, [mounted, resolvedTheme])

  if (!mounted) return <div className="fixed inset-0 pointer-events-none" aria-hidden="true" />
  if (resolvedTheme !== 'light') return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex:     -15,
        opacity:    0.88,
        transform:  'translateZ(0)',
        willChange: 'transform',
      }}
    />
  )
}
