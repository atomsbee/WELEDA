'use client'
import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'

const BRAND_HUES = [270, 320, 42, 162, 200, 340]

interface Bubble {
  x: number; y: number
  radius: number
  speedX: number; speedY: number
  wobble: number; wobbleSpeed: number; wobbleOffset: number
  life: number; lifeSpeed: number
  popping: boolean; popProgress: number
  hue: number
}

function spawnBubble(w: number, h: number, spread = false): Bubble {
  return {
    x:            Math.random() * w,
    y:            spread ? Math.random() * h : h + 60,
    radius:       12 + Math.random() * 36,
    speedX:       (Math.random() - 0.5) * 0.5,
    speedY:       -(0.3 + Math.random() * 0.7),
    wobble:       Math.random() * Math.PI * 2,
    wobbleSpeed:  0.008 + Math.random() * 0.016,
    wobbleOffset: Math.random() * Math.PI * 2,
    life:         spread ? Math.random() * 0.5 : 0,
    lifeSpeed:    0.0006 + Math.random() * 0.0009,
    popping:      false,
    popProgress:  0,
    hue:          BRAND_HUES[Math.floor(Math.random() * BRAND_HUES.length)],
  }
}

function drawBubble(ctx: CanvasRenderingContext2D, b: Bubble) {
  const r  = b.radius
  const wx = b.x + Math.sin(b.wobble + b.wobbleOffset) * 6
  const wy = b.y + Math.cos(b.wobble * 0.6 + b.wobbleOffset) * 2.5

  // ── POP ANIMATION ─────────────────────────────────────────
  if (b.popping) {
    const p = b.popProgress
    ctx.save()

    // Shockwave ring 1
    ctx.globalAlpha = (1 - p) * 0.75
    ctx.beginPath()
    ctx.arc(wx, wy, r * (1 + p * 2.5), 0, Math.PI * 2)
    ctx.strokeStyle = `hsla(${b.hue}, 90%, 82%, 1)`
    ctx.lineWidth   = 2
    ctx.stroke()

    // Shockwave ring 2 (offset)
    ctx.globalAlpha = (1 - p) * 0.40
    ctx.beginPath()
    ctx.arc(wx, wy, r * (1 + p * 1.6), 0, Math.PI * 2)
    ctx.strokeStyle = `hsla(${(b.hue + 60) % 360}, 80%, 86%, 1)`
    ctx.lineWidth   = 1
    ctx.stroke()

    // 8 glowing particle droplets
    for (let i = 0; i < 8; i++) {
      const angle  = (i / 8) * Math.PI * 2 + p * 0.5
      const travel = r * (1.2 + p * 3.8)
      const px     = wx + Math.cos(angle) * travel
      const py     = wy + Math.sin(angle) * travel
      const pr     = Math.max(0.1, 2.8 * (1 - p))

      // Glow around droplet
      ctx.globalAlpha = (1 - p) * 0.8
      const dg = ctx.createRadialGradient(px, py, 0, px, py, pr * 3.5)
      dg.addColorStop(0, `hsla(${(b.hue + i * 22) % 360}, 88%, 80%, 0.9)`)
      dg.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.beginPath()
      ctx.arc(px, py, pr * 3.5, 0, Math.PI * 2)
      ctx.fillStyle = dg
      ctx.fill()

      // Solid droplet core
      ctx.globalAlpha = (1 - p) * 0.9
      ctx.beginPath()
      ctx.arc(px, py, pr, 0, Math.PI * 2)
      ctx.fillStyle = `hsla(${(b.hue + i * 22) % 360}, 90%, 85%, 1)`
      ctx.fill()
    }

    // Central white flash (first 25% only)
    if (p < 0.25) {
      ctx.globalAlpha = ((0.25 - p) / 0.25) * 0.85
      const flash = ctx.createRadialGradient(wx, wy, 0, wx, wy, r * 0.5)
      flash.addColorStop(0, 'rgba(255,255,255,1)')
      flash.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.beginPath()
      ctx.arc(wx, wy, r * 0.5, 0, Math.PI * 2)
      ctx.fillStyle = flash
      ctx.fill()
    }

    ctx.restore()
    return
  }

  // ── NORMAL BUBBLE ──────────────────────────────────────────
  const alpha = Math.min(b.life * 12, 1) * Math.min((1 - b.life) * 7, 1)
  if (alpha <= 0) return

  ctx.save()

  // 1. Outer glow halo — makes bubble visible against dark bg
  const glowR = r * 1.7
  const glow  = ctx.createRadialGradient(wx, wy, r * 0.75, wx, wy, glowR)
  glow.addColorStop(0,   `hsla(${b.hue}, 88%, 72%, ${0.20 * alpha})`)
  glow.addColorStop(0.4, `hsla(${(b.hue + 40) % 360}, 82%, 76%, ${0.10 * alpha})`)
  glow.addColorStop(1,   'rgba(0,0,0,0)')
  ctx.beginPath()
  ctx.arc(wx, wy, glowR, 0, Math.PI * 2)
  ctx.fillStyle = glow
  ctx.fill()

  // 2. Sphere body — transparent glass
  const body = ctx.createRadialGradient(
    wx - r * 0.25, wy - r * 0.30, r * 0.02,
    wx, wy, r
  )
  body.addColorStop(0,    `hsla(${b.hue},      52%, 96%, ${0.20 * alpha})`)
  body.addColorStop(0.30, `hsla(${b.hue + 25}, 55%, 88%, ${0.08 * alpha})`)
  body.addColorStop(0.65, `hsla(${b.hue + 65}, 65%, 82%, ${0.04 * alpha})`)
  body.addColorStop(1,    'rgba(0,0,0,0)')
  ctx.beginPath()
  ctx.arc(wx, wy, r, 0, Math.PI * 2)
  ctx.fillStyle = body
  ctx.fill()

  // 3. Iridescent rim — 3 layered strokes = rainbow soap effect
  const ra = 0.78 * alpha
  ctx.beginPath()
  ctx.arc(wx, wy, r, 0, Math.PI * 2)
  ctx.strokeStyle = `hsla(${b.hue},              88%, 76%, ${ra * 0.65})`
  ctx.lineWidth   = 2.5
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(wx, wy, r - 0.6, 0, Math.PI * 2)
  ctx.strokeStyle = `hsla(${(b.hue + 80)  % 360}, 92%, 82%, ${ra * 0.50})`
  ctx.lineWidth   = 1.5
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(wx, wy, r - 1.2, 0, Math.PI * 2)
  ctx.strokeStyle = `hsla(${(b.hue + 180) % 360}, 82%, 86%, ${ra * 0.35})`
  ctx.lineWidth   = 1
  ctx.stroke()

  // 4. Primary specular — bright white glint top-left
  const s1 = ctx.createRadialGradient(
    wx - r * 0.30, wy - r * 0.33, 0,
    wx - r * 0.30, wy - r * 0.33, r * 0.42
  )
  s1.addColorStop(0,    `rgba(255,255,255,${0.68 * alpha})`)
  s1.addColorStop(0.25, `rgba(255,255,255,${0.32 * alpha})`)
  s1.addColorStop(0.65, `rgba(255,255,255,${0.08 * alpha})`)
  s1.addColorStop(1,    'rgba(255,255,255,0)')
  ctx.beginPath()
  ctx.arc(wx, wy, r, 0, Math.PI * 2)
  ctx.fillStyle = s1
  ctx.fill()

  // 5. Secondary highlight — bottom-right gleam
  ctx.beginPath()
  ctx.arc(wx + r * 0.36, wy + r * 0.30, r * 0.12, 0, Math.PI * 2)
  ctx.fillStyle = `rgba(255,255,255,${0.18 * alpha})`
  ctx.fill()

  // 6. Tiny catchlight — pinpoint top-center
  ctx.beginPath()
  ctx.arc(wx + r * 0.05, wy - r * 0.52, r * 0.055, 0, Math.PI * 2)
  ctx.fillStyle = `rgba(255,255,255,${0.28 * alpha})`
  ctx.fill()

  // 7. Inner colour reflection — refracted light at bottom
  const inner = ctx.createRadialGradient(
    wx, wy + r * 0.38, 0,
    wx, wy + r * 0.38, r * 0.52
  )
  inner.addColorStop(0, `hsla(${(b.hue + 150) % 360}, 82%, 78%, ${0.14 * alpha})`)
  inner.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.beginPath()
  ctx.arc(wx, wy, r * 0.88, 0, Math.PI * 2)
  ctx.fillStyle = inner
  ctx.fill()

  ctx.restore()
}

export default function BubbleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bubbles   = useRef<Bubble[]>([])
  const animRef   = useRef<number>(0)
  const mouse     = useRef({ x: -9999, y: -9999 })
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted || resolvedTheme !== 'dark') return

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

    const MAX = window.innerWidth < 768 ? 12 : 24

    for (let i = 0; i < Math.round(MAX * 0.75); i++) {
      bubbles.current.push(spawnBubble(canvas.width, canvas.height, true))
    }

    const tryPop = (b: Bubble) => {
      if (b.popping) return
      const wx = b.x + Math.sin(b.wobble + b.wobbleOffset) * 6
      const dx = mouse.current.x - wx
      const dy = mouse.current.y - b.y
      if (Math.sqrt(dx * dx + dy * dy) < b.radius + 18) b.popping = true
    }

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = bubbles.current.length - 1; i >= 0; i--) {
        const b = bubbles.current[i]

        if (b.popping) {
          b.popProgress += 0.052
          if (b.popProgress >= 1) { bubbles.current.splice(i, 1); continue }
          drawBubble(ctx, b)
          continue
        }

        b.x      += b.speedX
        b.y      += b.speedY
        b.wobble += b.wobbleSpeed
        b.life   += b.lifeSpeed

        b.speedX += (Math.random() - 0.5) * 0.016
        b.speedX  = Math.max(-0.85, Math.min(0.85, b.speedX))

        if (b.x < -b.radius * 2)               b.x = canvas.width + b.radius
        if (b.x > canvas.width + b.radius * 2) b.x = -b.radius

        tryPop(b)

        if (b.y < -b.radius * 3 || b.life >= 1) {
          bubbles.current.splice(i, 1)
          continue
        }

        drawBubble(ctx, b)
      }

      if (bubbles.current.length < MAX && Math.random() < 0.025) {
        bubbles.current.push(spawnBubble(canvas.width, canvas.height))
      }

      animRef.current = requestAnimationFrame(tick)
    }
    tick()

    const onMove  = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY } }
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0]
      if (t) mouse.current = { x: t.clientX, y: t.clientY }
    }
    const onClick = () => { bubbles.current.forEach(tryPop) }

    window.addEventListener('mousemove', onMove,  { passive: true })
    window.addEventListener('touchmove', onTouch, { passive: true })
    window.addEventListener('click',     onClick)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize',    resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onTouch)
      window.removeEventListener('click',     onClick)
      bubbles.current = []
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
        opacity:    1,
        transform:  'translateZ(0)',
        willChange: 'transform',
      }}
    />
  )
}
