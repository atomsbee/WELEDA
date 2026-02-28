'use client'

import { useCallback } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { CATEGORIES, PRODUCT_IMAGE, MARQUEE_ITEMS, CATEGORY_KEYS } from '@/lib/config/categories'

interface HeroSectionProps {
  campaignActive: boolean
  endDate: string | null
}

const heroVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.55,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
}

export default function HeroSection({ campaignActive, endDate }: HeroSectionProps) {
  const shouldReduceMotion = useReducedMotion()
  const { resolvedTheme } = useTheme()
  const isLight = resolvedTheme === 'light'

  const scrollToGrid = useCallback(() => {
    document.getElementById('influencer-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <>
      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 py-24">

        {/* Hero ambient glow — static soft violet behind headline text */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '50%',
            left: '35%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '400px',
            background: 'radial-gradient(ellipse at center, rgba(140,80,220,0.12) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-12 max-w-6xl mx-auto w-full">

          {/* Text block */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left flex-1 max-w-xl">

            {/* Shimmer campaign badge */}
            <motion.div custom={1} variants={heroVariants} initial="hidden" animate="visible" className="mb-5">
              <motion.span
                animate={shouldReduceMotion ? {} : { opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
                style={{
                  background: isLight ? 'rgba(212,168,83,0.12)' : 'rgba(212,168,83,0.15)',
                  border: `1px solid ${isLight ? 'rgba(146,100,10,0.35)' : 'rgba(212,168,83,0.4)'}`,
                  color: isLight ? '#7A4F00' : '#cb5f17',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: isLight ? '#7A4F00' : '#E8C97A' }} />
                Community Vote · 13.03 – 17.03.2026
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: isLight ? '#7A4F00' : '#E8C97A' }} />
              </motion.span>
            </motion.div>

            {/* Gradient headline */}
            <motion.h1
              custom={2}
              variants={heroVariants}
              initial="hidden"
              animate="visible"
              className="font-black leading-none mb-3"
              style={{ fontSize: 'clamp(2.6rem, 7vw, 5rem)', letterSpacing: '-0.02em' }}
            >
              <span style={{ color: 'var(--text-primary)' }}>WELEDA&apos;S</span>
              <br />
              <span
                style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #FFB6E8 0%, #B478FF 35%, #FFD700 65%, #FF6EB4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                SUMMER VOTE
              </span>
            </motion.h1>

            {/* Category subline */}
            <motion.p
              custom={3}
              variants={heroVariants}
              initial="hidden"
              animate="visible"
              className="text-sm md:text-base font-medium mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 justify-center lg:justify-start"
            >
              <span style={{ color: CATEGORIES['vanilla-cloud'].secondary }}>Vanilla Cloud</span>
              <span style={{ color: 'var(--text-faint)' }}>·</span>
              <span style={{ color: CATEGORIES['mystic-aura'].secondary }}>Mystic Aura</span>
              <span style={{ color: 'var(--text-faint)' }}>·</span>
              <span style={{ color: CATEGORIES['tropical-crush'].secondary }}>Tropical Crush</span>
            </motion.p>

            {/* Body */}
            <motion.p
              custom={4}
              variants={heroVariants}
              initial="hidden"
              animate="visible"
              className="text-base leading-relaxed mb-2 max-w-md"
              style={{ color: 'var(--text-secondary)' }}
            >
              Vote for your favourite creator in each fragrance category. One vote per category — up to 3 total!
            </motion.p>

            {endDate && (
              <motion.p custom={5} variants={heroVariants} initial="hidden" animate="visible" className="text-sm mb-8" style={{ color: 'var(--text-faint)' }}>
                {campaignActive ? `Voting open until ${endDate}` : `Voting ended on ${endDate}`}
              </motion.p>
            )}

            {/* CTA button */}
            <motion.div custom={6} variants={heroVariants} initial="hidden" animate="visible">
              <div className="relative inline-flex">
                <motion.button
                  whileHover={shouldReduceMotion ? {} : { scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={scrollToGrid}
                  className="relative px-10 py-4 rounded-full font-bold text-sm tracking-widest uppercase text-white"
                  style={{
                    background: 'linear-gradient(135deg, #B478FF 0%, #FFD700 33%, #FF6EB4 66%, #B478FF 100%)',
                  }}
                >
                  <span className="flex items-center gap-2">
                    Vote Now
                    <span>→</span>
                  </span>
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Floating product image */}
          <motion.div
            custom={5}
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            className="relative flex-shrink-0 hidden lg:block"
          >
            <motion.div
              animate={shouldReduceMotion ? {} : { y: [0, -14, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-[28rem] h-[28rem] xl:w-[32rem] xl:h-[32rem] rounded-3xl overflow-hidden"
              style={{
                background: 'var(--bg-card)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--border-card)',
                boxShadow: '0 0 60px rgba(180,120,255,0.3), 0 0 120px rgba(212,168,83,0.15)',
              }}
            >
              <Image
                src={PRODUCT_IMAGE}
                alt="WELEDA Summer Collection"
                fill
                className="object-cover"
                sizes="(min-width: 1280px) 672px, 544px"
                priority
              />
            </motion.div>
            {/* Ambient glow */}
            <div
              className="absolute -inset-8 rounded-3xl pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(180,120,255,0.25) 0%, rgba(212,168,83,0.1) 50%, transparent 70%)',
              }}
            />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        {!shouldReduceMotion && (
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            style={{ color: 'var(--text-faint)' }}
          >
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-[10px] uppercase tracking-widest">Scroll</span>
              <div
                className="w-5 h-8 rounded-full flex items-start justify-center p-1"
                style={{ border: '1px solid var(--border-chip)' }}
              >
                <motion.div
                  className="w-1 h-2 rounded-full"
                  style={{ background: 'var(--text-chip)' }}
                  animate={{ y: [0, 10, 0], opacity: [1, 0, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </section>

      {/* ── MARQUEE TICKER ────────────────────────────────────────────── */}
      <div
        className="overflow-hidden py-3"
        style={{
          background: 'var(--bg-card-inner)',
          backdropFilter: 'blur(8px)',
          borderTop: '1px solid var(--border-nav)',
          borderBottom: '1px solid var(--border-nav)',
        }}
      >
        <motion.div
          className="flex whitespace-nowrap"
          animate={shouldReduceMotion ? {} : { x: ['0%', '-50%'] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        >
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-4 px-4">
              <span className="text-xs font-bold tracking-widest uppercase flex-shrink-0" style={{ color: 'var(--text-chip)' }}>
                {item}
              </span>
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{
                  background: i % 3 === 0 ? '#B478FF' : i % 3 === 1 ? '#E8C97A' : '#52B788',
                }}
              />
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── CATEGORY MODEL CARDS ─────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-2xl md:text-3xl font-black mb-2 text-white"
        >
          Choose Your Fragrance World
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center text-sm mb-10 text-white/60"
        >
          One vote per category — discover all three and vote for your favourites.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {CATEGORY_KEYS.map((key, i) => {
            const cat = CATEGORIES[key]
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                whileHover={shouldReduceMotion ? {} : { y: -8, scale: 1.02 }}
                className="relative rounded-2xl overflow-hidden cursor-pointer group"
                onClick={scrollToGrid}
                style={{
                  background: 'var(--bg-card)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid var(--border-card)',
                  boxShadow: `0 0 40px ${cat.glow}`,
                  transition: 'box-shadow 0.3s, transform 0.3s',
                }}
              >
                {/* Model image */}
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src={cat.modelImage}
                    alt={cat.label}
                    fill
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 90vw, 30vw"
                  />
                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.88) 100%)' }}
                  />
                  {/* Iridescent hover overlay */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-25 transition-opacity duration-500"
                    style={{ background: cat.gradient, mixBlendMode: 'screen' }}
                  />
                </div>

                {/* Label */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold mb-2"
                    style={{ background: cat.gradient, color: 'white' }}
                  >
                    {cat.hashtag}
                  </div>
                  <p
                    className="font-black text-xl leading-tight"
                    style={{ color: 'white', textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}
                  >
                    {cat.label}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: 'rgba(255,255,255,0.70)', textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}
                  >
                    {cat.tagline}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ── VOTING RULES ─────────────────────────────────────────────── */}
      <section
        className="py-14"
        style={{
          background: 'var(--bg-card-inner)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid var(--border-nav)',
          borderBottom: '1px solid var(--border-nav)',
        }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <motion.h3
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center font-black text-xl mb-10 text-[#1a0a2e] dark:text-white"
          >
            How Voting Works
          </motion.h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { step: '01', title: 'Pick a Category', desc: 'Browse creators in Vanilla Cloud, Mystic Aura, or Tropical Crush.' },
              { step: '02', title: 'Cast Your Vote', desc: 'Enter your name and email. One vote per fragrance category.' },
              { step: '03', title: 'Up to 3 Votes', desc: 'You can vote once per category — three categories, three chances!' },
            ].map((r, i) => (
              <motion.div
                key={r.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex flex-col items-center gap-3"
              >
                <span
                  className="w-12 h-12 rounded-full flex items-center justify-center font-black text-base text-white"
                  style={{
                    background: 'linear-gradient(135deg, #B478FF 0%, #FFD700 100%)',
                    boxShadow: '0 0 24px rgba(180,120,255,0.45)',
                  }}
                >
                  {r.step}
                </span>
                <p className="font-bold text-[#1a0a2e] dark:text-white">{r.title}</p>
                <p className="text-sm leading-relaxed text-[#1a0a2e]/60 dark:text-white/50">{r.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
