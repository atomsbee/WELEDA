'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'

interface HeroSectionProps {
  campaignActive: boolean
  endDate: string | null
}

interface Particle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
}

const heroVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
}

export default function HeroSection({ campaignActive, endDate }: HeroSectionProps) {
  const shouldReduceMotion = useReducedMotion()
  const [particles, setParticles] = useState<Particle[]>([])

  const scrollToGrid = () => {
    document.getElementById('influencer-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  useEffect(() => {
    if (shouldReduceMotion) return
    const isMobile = window.innerWidth < 768
    const count = isMobile ? 8 : 20
    setParticles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 6 + 4,
        duration: Math.random() * 10 + 8,
        delay: Math.random() * 5,
      }))
    )
  }, [shouldReduceMotion])

  return (
    <section
      className="relative min-h-[60vh] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0b4535 0%, #0d5240 50%, #0b4535 100%)' }}
    >
      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/G%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative leaf elements */}
      <div className="absolute top-0 left-0 w-48 h-48 opacity-10 pointer-events-none">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0 C50 20 100 80 200 200 L0 200 Z" fill="#52B788" />
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 w-64 h-64 opacity-10 pointer-events-none">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M200 200 C150 180 100 120 0 0 L200 0 Z" fill="#52B788" />
        </svg>
      </div>

      {/* Gradient orbs — skip if reduced motion */}
      {!shouldReduceMotion && (
        <>
          <motion.div
            className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-[#52B788]/20 blur-3xl pointer-events-none"
            style={{ willChange: 'transform' }}
            animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-[#0b4535]/30 blur-3xl pointer-events-none"
            style={{ willChange: 'transform' }}
            animate={{ x: [0, -20, 0], y: [0, 20, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[#D4A853]/10 blur-3xl pointer-events-none"
            style={{ willChange: 'transform' }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
        </>
      )}

      {/* Floating particles — client-side only, skip if reduced motion */}
      {!shouldReduceMotion && particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/10 pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            willChange: 'transform, opacity',
          }}
          animate={{ y: [0, -80, 0], opacity: [0, 0.6, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 py-16 max-w-4xl mx-auto">

        {/* Logo */}
        <motion.div
          custom={0}
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <Image
            src="/weleda-logo-white.svg"
            alt="WELEDA"
            width={180}
            height={50}
            priority
            className="w-36 md:w-48"
          />
        </motion.div>

        {/* Animated badge */}
        <motion.div
          custom={1}
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          className="mb-6"
        >
          <motion.div
            className="relative overflow-hidden inline-flex items-center gap-2 px-4 py-2 rounded-full"
            style={{
              background: 'rgba(212,168,83,0.15)',
              border: '1px solid rgba(212,168,83,0.4)',
              color: '#D4A853',
            }}
            animate={shouldReduceMotion ? {} : {
              boxShadow: [
                '0 0 0px rgba(212,168,83,0)',
                '0 0 20px rgba(212,168,83,0.3)',
                '0 0 0px rgba(212,168,83,0)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {/* Shimmer sweep */}
            {!shouldReduceMotion && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1, ease: 'linear' }}
              />
            )}
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4A853] inline-block relative flex-shrink-0" />
            <span className="relative text-xs font-bold tracking-widest uppercase">
              Community Vote · 30 Creators · Your Vote Counts!
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4A853] inline-block relative flex-shrink-0" />
          </motion.div>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          custom={2}
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight mb-3 leading-none"
        >
          WELEDA&apos;S
          <br />
          <span className="text-weleda-gold">NEXT TOPMODEL</span>
        </motion.h1>

        {/* Subline */}
        <motion.p
          custom={3}
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          className="text-lg md:text-xl font-light italic mb-6"
          style={{ color: '#D4A853' }}
        >
          Community Voting
        </motion.p>

        {/* Body text */}
        <motion.p
          custom={4}
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          className="text-white/80 text-base md:text-lg max-w-xl mb-3 leading-relaxed"
        >
          Vote for the next face of WELEDA! Cast your vote for your favourite creator.
        </motion.p>

        {/* End date */}
        {endDate && (
          <motion.p
            custom={5}
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            className="text-white/50 text-sm mb-8"
          >
            {campaignActive ? `Voting open until ${endDate}` : `Voting ended on ${endDate}`}
          </motion.p>
        )}

        {/* CTA button */}
        <motion.div
          custom={6}
          variants={heroVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.button
            whileHover="hover"
            whileTap={{ scale: 0.97 }}
            onClick={scrollToGrid}
            className="relative overflow-hidden mt-4 w-full sm:w-auto px-10 py-4 rounded-full font-bold text-sm tracking-widest uppercase shadow-lg min-h-[52px]"
            style={{ background: '#D4A853', color: '#0b4535' }}
          >
            <motion.div
              className="absolute inset-0 bg-white/20 pointer-events-none"
              initial={{ x: '-100%' }}
              variants={{ hover: { x: '0%' } }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative flex items-center justify-center gap-2">
              Vote Now
              <motion.span
                variants={{ hover: { x: 4 } }}
                transition={{ duration: 0.2 }}
              >
                →
              </motion.span>
            </span>
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      {!shouldReduceMotion && (
        <motion.div
          className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <motion.div
            className="flex flex-col items-center gap-2"
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }}
          >
            <span className="uppercase text-xs tracking-widest">Scroll</span>
            <div className="w-5 h-8 rounded-full border border-white/30 flex items-start justify-center p-1">
              <motion.div
                className="w-1 h-2 rounded-full bg-white/60"
                animate={{ y: [0, 10, 0], opacity: [1, 0, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 2.5 }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60 L0 30 Q360 0 720 30 Q1080 60 1440 30 L1440 60 Z" fill="#FAFAF8" />
        </svg>
      </div>
    </section>
  )
}
