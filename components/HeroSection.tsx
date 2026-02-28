'use client'

import { useCallback } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { CATEGORIES, PRODUCT_IMAGE, MARQUEE_ITEMS, CATEGORY_KEYS } from '@/lib/config/categories'

interface HeroSectionProps {
  campaignActive: boolean
  endDate: string | null
}

// Spec-defined stagger sequence: badge(1)→headline(2)→pills(3)→subhead(4)→body(5)→date(6)→CTA(7)
const HERO_DELAYS = [0, 0.2, 0.4, 0.7, 0.85, 0.9, 1.1, 1.2]

const heroVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: HERO_DELAYS[i] ?? i * 0.12,
      duration: 0.55,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
}

const STEPS = [
  {
    chip: '02.03.–12.03',
    chipColor: '#F59E0B',
    title: 'Bewerbungsphase',
    body: 'Poste dein Video auf TikTok oder Instagram (mind. 30\u00a0Sek., max. 5\u00a0Min.).',
    tags: ['#weledacasting', '#fragrancemists'],
    highlight: false,
  },
  {
    chip: 'TOP 10',
    chipColor: '#8B5CF6',
    title: 'Vorauswahl',
    body: 'Wir w\u00e4hlen 10 Creator nach Kreativit\u00e4t, Vibe, Brand Fit & Authentizit\u00e4t.',
    tags: ['DM-Benachrichtigung'],
    highlight: false,
  },
  {
    chip: '13.03–17.03',
    chipColor: '#EC4899',
    title: 'Voting-Phase',
    body: '1\u00d7 t\u00e4glich abstimmen, 5 Tage lang. Mach ordentlich Werbung f\u00fcr dich!',
    tags: ['1\u00d7 t\u00e4glich', '5 Tage'],
    highlight: false,
  },
  {
    chip: '2 TICKETS',
    chipColor: '#10B981',
    title: 'Finale-Tickets',
    body: '1\u00d7 Wildcard von WELEDA \u00b7 1\u00d7 Community-Gewinner:in. Best\u00e4tigung in 24h.',
    tags: ['Wildcard', 'Community Vote'],
    highlight: false,
  },
  {
    chip: '22.03–25.03',
    chipColor: '#F59E0B',
    title: 'Teneriffa \uD83C\uDF34',
    body: 'Live-Casting. WELEDA \u00fcbernimmt Reise, Unterkunft & Verpflegung.',
    tags: ['\u2708\uFE0F All inclusive'],
    highlight: true,
  },
  {
    chip: 'TOP 3',
    chipColor: '#8B5CF6',
    title: 'Kampagnen-Shooting',
    body: 'Foto + Video f\u00fcr die WELEDA Fragrance Body & Hair Mist Campaign.',
    tags: ['\uD83D\uDCF8 Foto', '\uD83C\uDFAC Video'],
    highlight: false,
  },
]

const REQUIREMENTS_LEFT = [
  '18\u201335 Jahre alt',
  'Wohnsitz in DE, AT oder CH',
  '\u00d6ffentliches Instagram oder TikTok Profil',
  'Video als Feed-Post oder Reel (keine Story)',
  '@weleda markieren',
  '#weledacasting #fragrancemists nutzen',
  'Vom 22.\u201326.03. verf\u00fcgbar sein',
]

const BENEFITS = [
  {
    icon: '🌟',
    title: 'Kampagnen-Face',
    sub: 'Eines von 3 neuen Gesichtern der WELEDA Campaign',
    color: '#F59E0B',
  },
  {
    icon: '✈️',
    title: 'Teneriffa \u2014 all inclusive',
    sub: 'Reise, Unterkunft & Verpflegung \u2014 alles von WELEDA',
    color: '#10B981',
  },
  {
    icon: '📸',
    title: 'Kampagnen-Shooting',
    sub: 'Professionelles Foto + Video f\u00fcr die Fragrance Campaign',
    color: '#EC4899',
  },
  {
    icon: '💜',
    title: 'WELEDA Social Feature',
    sub: 'Feature auf den offiziellen WELEDA Kan\u00e4len',
    color: '#8B5CF6',
  },
  {
    icon: '📜',
    title: 'Faire Bedingungen',
    sub: 'Nutzungsrechte & transparente Konditionen',
    color: '#60A5FA',
  },
]


export default function HeroSection({ campaignActive, endDate }: HeroSectionProps) {
  void campaignActive
  void endDate
  const shouldReduceMotion = useReducedMotion()

  const scrollToGrid = useCallback(() => {
    document.getElementById('influencer-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 py-24">

        {/* Ambient glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '50%', left: '35%',
            transform: 'translate(-50%, -50%)',
            width: '600px', height: '400px',
            background: 'radial-gradient(ellipse at center, rgba(140,80,220,0.12) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-12 max-w-6xl mx-auto w-full">

          {/* Text block */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left flex-1 max-w-xl">

            {/* Campaign badge */}
            <motion.div custom={1} variants={heroVariants} initial="hidden" animate="visible" className="mb-5">
              <motion.span
                animate={shouldReduceMotion ? {} : { opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
                style={{
                  background: 'var(--campaign-badge-bg)',
                  border: '1px solid var(--campaign-badge-border)',
                  color: 'var(--campaign-badge-text)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: 'var(--campaign-badge-dot)' }} />
                ✦ COMMUNITY VOTE · 13–17.03.2026 ✦
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: 'var(--campaign-badge-dot)' }} />
              </motion.span>
            </motion.div>

            {/* Gradient headline — 3 lines */}
            <motion.h1
              custom={2}
              variants={heroVariants}
              initial="hidden"
              animate="visible"
              className="font-black leading-none mb-3"
              style={{ fontSize: 'clamp(2.6rem, 7vw, 5rem)', letterSpacing: '-0.02em' }}
            >
              <span style={{ color: 'var(--text-primary)' }}>DEIN</span>
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
                WELEDA
              </span>
              <br />
              <span
                style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #B478FF 0%, #FFD700 50%, #FF6EB4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                SUMMER ✦
              </span>
            </motion.h1>

            {/* Category pills */}
            <motion.p
              custom={3}
              variants={heroVariants}
              initial="hidden"
              animate="visible"
              className="text-sm md:text-base font-bold mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 justify-center lg:justify-start"
            >
              <span style={{ color: CATEGORIES['vanilla-cloud'].primary }}>Vanilla Cloud</span>
              <span style={{ color: 'var(--text-faint)' }}>·</span>
              <span style={{ color: CATEGORIES['mystic-aura'].primary }}>Mystic Aura</span>
              <span style={{ color: 'var(--text-faint)' }}>·</span>
              <span style={{ color: CATEGORIES['tropical-crush'].primary }}>Tropical Crush</span>
            </motion.p>

            {/* Subhead */}
            <motion.p
              custom={4}
              variants={heroVariants}
              initial="hidden"
              animate="visible"
              className="text-base leading-relaxed mb-2 max-w-md"
              style={{ color: 'var(--text-secondary)' }}
            >
              Drei Fragrances. Drei Gesichter. Bist du dabei? Vote f&uuml;r deinen Favoriten&nbsp;&mdash; 1&times; pro Kategorie.
            </motion.p>

            {/* Fixed body */}
            <motion.p
              custom={5}
              variants={heroVariants}
              initial="hidden"
              animate="visible"
              className="text-sm leading-relaxed mb-3 max-w-md"
              style={{ color: 'var(--text-muted)' }}
            >
              Bist du zwischen 18 und 35 Jahre alt? Dann werde Teil unserer &bdquo;Weleda Summer Campaign&ldquo;! Du hast die einmalige Chance eines von drei neuen Kampagnengesichtern zu werden.
            </motion.p>

            {/* Voting phase */}
            <motion.p
              custom={6}
              variants={heroVariants}
              initial="hidden"
              animate="visible"
              className="text-sm mb-8"
              style={{ color: 'var(--text-faint)' }}
            >
              Voting-Phase: 13.03. – 17.03.2026
            </motion.p>

            {/* CTA */}
            <motion.div custom={7} variants={heroVariants} initial="hidden" animate="visible">
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
                  JETZT ABSTIMMEN
                  <span>→</span>
                </span>
              </motion.button>
            </motion.div>
          </div>

          {/* Product image */}
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
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        >
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-4 px-4">
              <span className="text-xs font-bold tracking-widest uppercase flex-shrink-0" style={{ color: 'var(--text-chip)' }}>
                {item}
              </span>
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: i % 3 === 0 ? '#B478FF' : i % 3 === 1 ? '#E8C97A' : '#52B788' }}
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
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src={cat.modelImage}
                    alt={cat.label}
                    fill
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 90vw, 30vw"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.88) 100%)' }}
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-25 transition-opacity duration-500"
                    style={{ background: cat.gradient, mixBlendMode: 'screen' }}
                  />
                </div>
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

      {/* ── CASTING TIMELINE — compact horizontal stepper ─────────── */}
      <section className="py-20 px-2 md:px-4 overflow-hidden">

        {/* Section header */}
        <div className="text-center mb-12">
          <p
            className="text-xs font-bold tracking-[0.25em] uppercase mb-3"
            style={{ color: 'var(--text-faint)' }}
          >
            Deine Reise
          </p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.4 }}
            className="text-3xl md:text-5xl font-black"
            style={{ color: 'var(--text-primary)' }}
          >
            So l&auml;uft das Casting ab
          </motion.h2>
          <p className="text-base mt-3" style={{ color: 'var(--text-muted)' }}>
            Von der Bewerbung bis zum Shooting &mdash; alle Schritte auf einen Blick.
          </p>
        </div>

        {/* Desktop / Tablet: always 6 cols, horizontal scroll on narrow md */}
        <div className="hidden md:block">
          <div className="overflow-x-auto scrollbar-hide pb-4">
            <div className="relative min-w-[820px] max-w-[1380px] mx-auto px-4 md:px-10">
              {/* Gradient connecting line through badge centers */}
              <div
                className="absolute top-6 left-[4%] right-[4%] h-[2px] pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, #F59E0B 0%, #8B5CF6 20%, #EC4899 40%, #10B981 60%, #F59E0B 80%, #8B5CF6 100%)',
                  opacity: 0.45,
                }}
              />

              <div className="grid grid-cols-6 gap-2 xl:gap-3 pt-6">
                {STEPS.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                  >
                    {/* pt-6 on grid creates clearance for badge above card */}
                    <div className="relative h-full">

                      {/* Number badge — overlaps top edge of card */}
                      <div
                        className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black"
                        style={{
                          background: step.chipColor,
                          boxShadow: `0 0 0 3px var(--badge-ring-color), 0 4px 12px ${step.chipColor}55`,
                        }}
                      >
                        {i + 1}
                      </div>

                      {/* Card — pt-7 leaves room for badge */}
                      <div
                        className="rounded-2xl pt-7 px-4 pb-4 h-full flex flex-col"
                        style={{
                          background: step.highlight ? 'rgba(245,158,11,0.09)' : 'var(--step-card-bg)',
                          border: step.highlight
                            ? '1px solid rgba(245,158,11,0.50)'
                            : `1px solid ${step.chipColor}28`,
                          backdropFilter: 'blur(12px)',
                          boxShadow: step.highlight ? '0 0 30px rgba(245,158,11,0.12)' : undefined,
                        }}
                      >
                        {/* Top content: chip + title + body */}
                        <div className="flex-1">
                          <span
                            className="inline-block text-[10px] font-black tracking-wider px-2 py-0.5 rounded-full mb-2"
                            style={{
                              background: `${step.chipColor}20`,
                              color: step.chipColor,
                              border: `1px solid ${step.chipColor}50`,
                            }}
                          >
                            {step.chip}
                          </span>
                          <p
                            className="font-bold text-sm leading-tight mb-1.5"
                            style={{ color: step.highlight ? '#F59E0B' : 'var(--text-primary)' }}
                          >
                            {step.title}
                          </p>
                          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            {step.body}
                          </p>
                        </div>

                        {/* Tags — pinned to bottom */}
                        <div className="flex flex-wrap gap-1 mt-3">
                          {step.tags.map((tag, j) => (
                            <span
                              key={j}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                              style={{
                                background: `${step.chipColor}15`,
                                color: step.chipColor,
                                border: `1px solid ${step.chipColor}40`,
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: compact vertical list */}
        <div className="md:hidden max-w-lg mx-auto">
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="flex gap-4 pb-6 relative"
            >
              {/* Dot + vertical line */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black shadow-md z-10"
                  style={{ background: step.chipColor }}
                >
                  {i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className="w-px flex-1 mt-2"
                    style={{ background: `${step.chipColor}30`, minHeight: '32px' }}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span
                    className="text-[10px] font-black tracking-wider px-2 py-0.5 rounded-full"
                    style={{
                      background: `${step.chipColor}20`,
                      color: step.chipColor,
                      border: `1px solid ${step.chipColor}50`,
                    }}
                  >
                    {step.chip}
                  </span>
                  <p
                    className="font-bold text-sm"
                    style={{ color: step.highlight ? '#F59E0B' : 'var(--text-primary)' }}
                  >
                    {step.title}
                  </p>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {step.body}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {step.tags.map((tag, j) => (
                    <span
                      key={j}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        background: `${step.chipColor}15`,
                        color: step.chipColor,
                        border: `1px solid ${step.chipColor}40`,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* "Was du wissen musst" — two distinct emotional cards */}
        <div className="max-w-5xl mx-auto mt-20">
          <p
            className="text-center text-xs font-black tracking-[0.25em] uppercase mb-3"
            style={{ color: 'var(--text-faint)' }}
          >
            Auf einen Blick
          </p>
          <motion.h3
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.4 }}
            className="text-center text-3xl font-black mb-10"
            style={{ color: 'var(--text-primary)' }}
          >
            Was du wissen musst
          </motion.h3>

          <div className="grid md:grid-cols-2 gap-5">

            {/* LEFT CARD — clean checklist */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl p-7"
              style={{
                background: 'var(--wissen-left-bg)',
                border: '1px solid var(--wissen-left-border)',
                backdropFilter: 'blur(20px)',
              }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: 'rgba(139,92,246,0.15)' }}
                >
                  📋
                </div>
                <div>
                  <p className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: '#8B5CF6' }}>
                    Voraussetzungen
                  </p>
                  <p className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>Mitmachen</p>
                </div>
              </div>

              {/* Checklist */}
              <ul className="space-y-3">
                {REQUIREMENTS_LEFT.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center"
                      style={{
                        background: 'rgba(16,185,129,0.15)',
                        border: '1px solid rgba(16,185,129,0.35)',
                      }}
                    >
                      <svg className="w-2.5 h-2.5" viewBox="0 0 10 10" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="1.5,5 4,7.5 8.5,2" />
                      </svg>
                    </div>
                    <span className="text-sm leading-snug" style={{ color: 'var(--text-secondary)' }}>{req}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* RIGHT CARD — premium benefits */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-3xl p-7 relative overflow-hidden"
              style={{
                background: 'var(--wissen-right-bg)',
                border: '1px solid rgba(139,92,246,0.25)',
                backdropFilter: 'blur(20px)',
              }}
            >
              {/* Decorative glow blob */}
              <div
                className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, var(--glow-blob-color) 0%, transparent 70%)',
                  filter: 'blur(30px)',
                }}
              />

              {/* Header */}
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: 'rgba(245,158,11,0.15)' }}
                >
                  🎁
                </div>
                <div>
                  <p className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: '#EC4899' }}>
                    Deine Belohnung
                  </p>
                  <p className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>Das bekommst du</p>
                </div>
              </div>

              {/* Benefit mini-cards */}
              <div className="space-y-2.5 relative z-10">
                {BENEFITS.map((benefit, bi) => (
                  <div
                    key={bi}
                    className="flex items-start gap-3 rounded-2xl p-3"
                    style={{
                      background: `${benefit.color}09`,
                      border: `1px solid ${benefit.color}25`,
                    }}
                  >
                    <span className="text-xl flex-shrink-0 leading-none mt-0.5">{benefit.icon}</span>
                    <div>
                      <p className="font-semibold text-sm leading-tight" style={{ color: 'var(--text-primary)' }}>
                        {benefit.title}
                      </p>
                      <p className="text-xs mt-0.5 leading-snug" style={{ color: 'var(--text-secondary)' }}>
                        {benefit.sub}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </>
  )
}
