'use client'
import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'

// Brand hues: violet=270, pink=320, gold=42, teal=162, sky=200
const BRAND_HUES = [270, 320, 42, 162, 200]

interface Bubble {
  x:            number
  y:            number
  radius:       number
  speedX:       number
  speedY:       number
  opacity:      number
  wobble:       number
  wobbleSpeed:  number
  wobbleOffset: number
  life:         number   // 0 → 1
  lifeSpeed:    number
  popping:      boolean
  popProgress:  number
  hue:          number
}

function createBubble(canvasW: number, canvasH: number): Bubble {
  return {
    x:            Math.random() * canvasW,
    y:            canvasH + 60,
    radius:       10 + Math.random() * 38,
    speedX:       (Math.random() - 0.5) * 0.55,
    speedY:       -(0.35 + Math.random() * 0.75),
    opacity:      0.13 + Math.random() * 0.20,
    wobble:       0,
    wobbleSpeed:  0.008 + Math.random() * 0.018,
    wobbleOffset: Math.random() * Math.PI * 2,
    life:         0,
    lifeSpeed:    0.0007 + Math.random() * 0.001,
    popping:      false,
    popProgress:  0,
    hue:          BRAND_HUES[Math.floor(Math.random() * BRAND_HUES.length)],
  }
}

function drawBubble(ctx: CanvasRenderingContext2D, b: Bubble) {
  // --- POP ANIMATION ---
  if (b.popping) {
    const p = b.popProgress
    ctx.save()

    // Expanding ring
    ctx.globalAlpha = (1 - p) * 0.55
    ctx.beginPath()
    ctx.arc(b.x, b.y, b.radius * (1 + p * 2.2), 0, Math.PI * 2)
    ctx.strokeStyle = `hsla(${b.hue}, 85%, 82%, 1)`
    ctx.lineWidth   = 1.5
    ctx.stroke()

    // 8 particle droplets burst outward
    for (let i = 0; i < 8; i++) {
      const angle  = (i / 8) * Math.PI * 2
      const travel = b.radius * (1 + p * 3.5)
      const px     = b.x + Math.cos(angle) * travel
      const py     = b.y + Math.sin(angle) * travel
      const pr     = 2.5 * (1 - p)
      ctx.globalAlpha = (1 - p) * 0.7
      ctx.beginPath()
      ctx.arc(px, py, Math.max(pr, 0.1), 0, Math.PI * 2)
      ctx.fillStyle = `hsla(${b.hue + i * 15}, 80%, 85%, 1)`
      ctx.fill()
    }

    // Tiny inner sparkle flash
    ctx.globalAlpha = (1 - p) * 0.9 * (p < 0.3 ? 1 : 0)
    ctx.beginPath()
    ctx.arc(b.x, b.y, b.radius * 0.25, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.fill()

    ctx.restore()
    return
  }

  // --- NORMAL BUBBLE ---
  const wx   = b.x + Math.sin(b.wobble + b.wobbleOffset) * 7
  const wy   = b.y + Math.cos(b.wobble * 0.7) * 3   // slight vertical wobble too
  const fade = Math.min(b.life * 10, 1) * Math.min((1 - b.life) * 6, 1)

  ctx.save()
  ctx.globalAlpha = b.opacity * fade

  // 1. Main body — subtle fill, iridescent center
  const bodyGrad = ctx.createRadialGradient(
    wx - b.radius * 0.28, wy - b.radius * 0.28, b.radius * 0.04,
    wx, wy, b.radius
  )
  bodyGrad.addColorStop(0,    `hsla(${b.hue},      55%, 96%, 0.22)`)
  bodyGrad.addColorStop(0.25, `hsla(${b.hue + 30}, 50%, 88%, 0.08)`)
  bodyGrad.addColorStop(0.6,  `hsla(${b.hue + 70}, 65%, 82%, 0.04)`)
  bodyGrad.addColorStop(1,    `hsla(${b.hue + 120},75%, 90%, 0.00)`)

  ctx.beginPath()
  ctx.arc(wx, wy, b.radius, 0, Math.PI * 2)
  ctx.fillStyle = bodyGrad
  ctx.fill()

  // 2. Iridescent rim — rainbow gradient stroke
  const angle0 = b.wobble * 0.5  // slowly rotates the rainbow
  const rimGrad = ctx.createLinearGradient(
    wx + Math.cos(angle0)           * b.radius,
    wy + Math.sin(angle0)           * b.radius,
    wx + Math.cos(angle0 + Math.PI) * b.radius,
    wy + Math.sin(angle0 + Math.PI) * b.radius,
  )
  rimGrad.addColorStop(0,    `hsla(${b.hue},       85%, 78%, 0.70)`)
  rimGrad.addColorStop(0.20, `hsla(${b.hue +  60}, 90%, 82%, 0.50)`)
  rimGrad.addColorStop(0.40, `hsla(${b.hue + 120}, 85%, 86%, 0.65)`)
  rimGrad.addColorStop(0.60, `hsla(${b.hue + 180}, 80%, 84%, 0.45)`)
  rimGrad.addColorStop(0.80, `hsla(${b.hue + 240}, 85%, 80%, 0.55)`)
  rimGrad.addColorStop(1,    `hsla(${b.hue + 300}, 85%, 78%, 0.70)`)

  ctx.beginPath()
  ctx.arc(wx, wy, b.radius, 0, Math.PI * 2)
  ctx.strokeStyle = rimGrad
  ctx.lineWidth   = 1.2
  ctx.stroke()

  // 3. Primary specular highlight — top-left bright glint
  const spec1 = ctx.createRadialGradient(
    wx - b.radius * 0.33, wy - b.radius * 0.36, 0,
    wx - b.radius * 0.33, wy - b.radius * 0.36, b.radius * 0.42
  )
  spec1.addColorStop(0,   'rgba(255,255,255,0.60)')
  spec1.addColorStop(0.3, 'rgba(255,255,255,0.20)')
  spec1.addColorStop(1,   'rgba(255,255,255,0.00)')

  ctx.beginPath()
  ctx.arc(wx, wy, b.radius, 0, Math.PI * 2)
  ctx.fillStyle = spec1
  ctx.fill()

  // 4. Secondary highlight — small bottom-right gleam
  ctx.beginPath()
  ctx.arc(
    wx + b.radius * 0.38,
    wy + b.radius * 0.32,
    b.radius * 0.13,
    0, Math.PI * 2
  )
  ctx.fillStyle = 'rgba(255,255,255,0.14)'
  ctx.fill()

  // 5. Tiny top-center catchlight
  ctx.beginPath()
  ctx.arc(
    wx + b.radius * 0.04,
    wy - b.radius * 0.55,
    b.radius * 0.06,
    0, Math.PI * 2
  )
  ctx.fillStyle = 'rgba(255,255,255,0.22)'
  ctx.fill()

  ctx.restore()
}

export default function BubbleCanvas() {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const bubblesRef = useRef<Bubble[]>([])
  const animRef    = useRef<number>(0)
  const mouseRef   = useRef({ x: -9999, y: -9999 })
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted || resolvedTheme !== 'dark') return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // --- SETUP ---
    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    // Max bubbles: fewer on mobile for perf
    const MAX = window.innerWidth < 768 ? 12 : 22

    // Seed initial bubbles spread across viewport
    for (let i = 0; i < Math.floor(MAX * 0.8); i++) {
      const b = createBubble(canvas.width, canvas.height)
      b.y    = Math.random() * canvas.height  // start spread
      b.life = Math.random() * 0.45           // varied ages
      bubblesRef.current.push(b)
    }

    // --- POP CHECK ---
    const tryPop = (b: Bubble) => {
      if (b.popping) return
      const wx  = b.x + Math.sin(b.wobble + b.wobbleOffset) * 7
      const dx  = mouseRef.current.x - wx
      const dy  = mouseRef.current.y - b.y
      const d   = Math.sqrt(dx * dx + dy * dy)
      if (d < b.radius + 18) b.popping = true
    }

    // --- ANIMATION LOOP ---
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const bubbles = bubblesRef.current

      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i]

        if (b.popping) {
          b.popProgress += 0.055
          if (b.popProgress >= 1) { bubbles.splice(i, 1); continue }
          drawBubble(ctx, b)
          continue
        }

        // Physics
        b.x      += b.speedX
        b.y      += b.speedY
        b.wobble += b.wobbleSpeed
        b.life   += b.lifeSpeed

        // Gentle meander
        b.speedX += (Math.random() - 0.5) * 0.018
        b.speedX  = Math.max(-0.9, Math.min(0.9, b.speedX))

        // Wrap horizontally so bubbles don't escape sides
        if (b.x < -b.radius * 2)              b.x = canvas.width  + b.radius
        if (b.x > canvas.width + b.radius * 2) b.x = -b.radius

        tryPop(b)

        if (b.y < -b.radius * 2 || b.life >= 1) {
          bubbles.splice(i, 1)
          continue
        }

        drawBubble(ctx, b)
      }

      // Spawn to maintain population
      if (bubbles.length < MAX && Math.random() < 0.022) {
        bubbles.push(createBubble(canvas.width, canvas.height))
      }

      animRef.current = requestAnimationFrame(tick)
    }
    tick()

    // --- EVENT LISTENERS ---
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0]
      if (t) mouseRef.current = { x: t.clientX, y: t.clientY }
    }
    const onClick = () => {
      // Pop ALL bubbles near cursor on click
      bubblesRef.current.forEach(b => tryPop(b))
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('touchmove',  onTouchMove, { passive: true })
    window.addEventListener('click',      onClick)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize',    resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('click',     onClick)
      bubblesRef.current = []
    }
  }, [mounted, resolvedTheme])

  if (!mounted || resolvedTheme !== 'dark') return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex:     -15,
        opacity:    0.92,
        // GPU compositing — no scroll jank
        transform:  'translateZ(0)',
        willChange: 'transform',
      }}
    />
  )
}
