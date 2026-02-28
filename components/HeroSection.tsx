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

const CASTING_RULES = [
  {
    icon: '📱',
    title: 'Bewerbe dich',
    desc: 'Poste dein Video auf TikTok oder Instagram (mind. 30 Sek.\u00a0\u00b7 max. 5 Min.) Markiere @weleda und nutze #weledacasting\u00a0#fragrancemists',
  },
  {
    icon: '🗳',
    title: 'Community votet',
    desc: '13.03.\u201317.03.: Die Community stimmt 1\u00d7 t\u00e4glich f\u00fcr ihre Favorites ab. Du darfst ordentlich Werbung f\u00fcr dich machen!',
  },
  {
    icon: '🏆',
    title: '2 Tickets fürs Finale',
    desc: '1\u00d7 Wildcard von WELEDA\n1\u00d7 Community-Gewinner:in\nLive-Casting auf Teneriffa, 22.\u201325.03.2026',
  },
]

interface EditorialStep {
  num: number
  date: string
  label: string
  color: string
  isGolden?: boolean
}

const EDITORIAL_STEPS: EditorialStep[] = [
  { num: 1, date: '02.03.\u00a0\u2013\u00a012.03.', label: 'BEWERBUNGSPHASE',     color: '#F59E0B' },
  { num: 2, date: 'TOP 10',                      label: 'VORAUSWAHL',           color: '#8B5CF6' },
  { num: 3, date: '13.03.\u00a0\u2013\u00a017.03.', label: 'VOTING-PHASE',        color: '#EC4899' },
  { num: 4, date: '2 TICKETS',                   label: 'FINALE-TICKETS',       color: '#10B981' },
  { num: 5, date: '22.03.\u00a0\u2013\u00a025.03.', label: 'LIVE-CASTING TENERIFFA', color: '#F59E0B', isGolden: true },
  { num: 6, date: 'TOP 3',                       label: 'KAMPAGNENPRODUKTION',  color: '#8B5CF6' },
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

const REQUIREMENTS_RIGHT = [
  { emoji: '🌟', text: 'Chance auf eines von 3 Kampagnen-Faces' },
  { emoji: '✈️', text: 'Reise nach Teneriffa (all inclusive)' },
  { emoji: '📸', text: 'Kampagnen-Shooting (Foto + Video)' },
  { emoji: '💜', text: 'Feature auf WELEDA Social Media' },
  { emoji: '📜', text: 'Nutzungsrechte & faire Bedingungen' },
]

const CHIP_STYLE = {
  background: 'var(--bg-chip)',
  border: '1px solid var(--border-chip)',
  color: 'var(--text-chip)',
}

function renderStepContent(step: EditorialStep) {
  switch (step.num) {
    case 1:
      return (
        <>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
            Poste dein Video. Alle g&uuml;ltigen Videos kommen ins Rennen.
          </p>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #010101, #69C9D0)' }}>TikTok</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #833AB4, #FD1D1D, #F56040)' }}>Instagram</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['mind. 30 Sek.', 'max. 5 Min.', '#weledacasting', '#fragrancemists'].map((t) => (
              <span key={t} className="px-2.5 py-0.5 rounded-full text-[11px] font-medium" style={CHIP_STYLE}>{t}</span>
            ))}
          </div>
          <p className="text-xs mt-2" style={{ color: 'var(--text-faint)' }}>Deadline: 12.03. 24:00 Uhr</p>
        </>
      )
    case 2:
      return (
        <>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
            Wir w&auml;hlen 10 Creator aus. Benachrichtigung per DM.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {['Kreativit\u00e4t', 'Vibe', 'Brand Fit', 'Authentizit\u00e4t'].map((c) => (
              <div key={c} className="px-3 py-2 rounded-xl text-xs font-bold text-center"
                style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', color: '#8B5CF6' }}>
                {c}
              </div>
            ))}
          </div>
        </>
      )
    case 3:
      return (
        <>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
            Die Community votet t&auml;glich f&uuml;r ihre Faves.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(236,72,153,0.10)', border: '1px solid rgba(236,72,153,0.20)' }}>
              <p className="text-2xl font-black" style={{ color: '#EC4899' }}>1&times;</p>
              <p className="text-xs text-[#1a0a2e]/60 dark:text-white/50">t&auml;glich voten</p>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(236,72,153,0.10)', border: '1px solid rgba(236,72,153,0.20)' }}>
              <p className="text-2xl font-black" style={{ color: '#EC4899' }}>5</p>
              <p className="text-xs text-[#1a0a2e]/60 dark:text-white/50">Tage Voting</p>
            </div>
          </div>
          <p className="text-xs mt-2" style={{ color: 'var(--text-faint)' }}>Mach ordentlich Werbung f&uuml;r dich!</p>
        </>
      )
    case 4:
      return (
        <>
          <div className="space-y-2">
            {[
              { emoji: '⭐', title: 'Wildcard', sub: 'Kuratiert von WELEDA' },
              { emoji: '🗳', title: 'Community-Ticket', sub: 'Das Community-Voting entscheidet' },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3 rounded-xl p-3"
                style={{ background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.20)' }}>
                <span className="text-xl flex-shrink-0">{item.emoji}</span>
                <div>
                  <p className="text-xs font-bold" style={{ color: '#10B981' }}>{item.title}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs mt-2" style={{ color: 'var(--text-faint)' }}>Best&auml;tigung innerhalb 24h erforderlich.</p>
        </>
      )
    case 5:
      return (
        <>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
            Challenges, Content, Vibes auf Teneriffa. Du postest Reels/Posts auf deinem Kanal.
          </p>
          <div className="rounded-xl p-3" style={{ background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.25)' }}>
            <p className="text-xs font-bold mb-2" style={{ color: '#F59E0B' }}>WELEDA &uuml;bernimmt</p>
            <div className="flex flex-wrap gap-2">
              {['\u2708\ufe0f Reise', '\u{1F3E8} Unterkunft', '\u{1F37D}\ufe0f Verpflegung'].map((item) => (
                <span key={item} className="px-2.5 py-1 rounded-full text-[11px] font-semibold text-white"
                  style={{ background: 'rgba(245,158,11,0.65)' }}>{item}</span>
              ))}
            </div>
          </div>
        </>
      )
    case 6:
      return (
        <>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
            Direkt nach dem Finale: Shooting f&uuml;r die Weleda Fragrance Body &amp; Hair Mist Campaign. Let&apos;s make it official.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 rounded-full text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}>📸 Foto-Shooting</span>
            <span className="px-3 py-1.5 rounded-full text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}>🎬 Video-Shooting</span>
          </div>
        </>
      )
    default:
      return null
  }
}

export default function HeroSection({ campaignActive, endDate }: HeroSectionProps) {
  void campaignActive
  void endDate
  const shouldReduceMotion = useReducedMotion()
  const { resolvedTheme } = useTheme()
  const isLight = resolvedTheme === 'light'

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
                  background: isLight ? 'rgba(212,168,83,0.12)' : 'rgba(212,168,83,0.15)',
                  border: `1px solid ${isLight ? 'rgba(146,100,10,0.35)' : 'rgba(212,168,83,0.4)'}`,
                  color: isLight ? '#7A4F00' : '#cb5f17',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: isLight ? '#7A4F00' : '#E8C97A' }} />
                ✦ COMMUNITY VOTE · 13–17.03.2026 ✦
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: isLight ? '#7A4F00' : '#E8C97A' }} />
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
              className="text-sm md:text-base font-medium mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 justify-center lg:justify-start"
            >
              <span style={{ color: CATEGORIES['vanilla-cloud'].secondary }}>Vanilla Cloud</span>
              <span style={{ color: 'var(--text-faint)' }}>·</span>
              <span style={{ color: CATEGORIES['mystic-aura'].secondary }}>Mystic Aura</span>
              <span style={{ color: 'var(--text-faint)' }}>·</span>
              <span style={{ color: CATEGORIES['tropical-crush'].secondary }}>Tropical Crush</span>
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

      {/* ── SO FUNKTIONIERT'S ─────────────────────────────────────────── */}
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
            So funktioniert&apos;s
          </motion.h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {CASTING_RULES.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex flex-col items-center gap-3"
              >
                <span
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #B478FF 0%, #FFD700 100%)',
                    boxShadow: '0 0 24px rgba(180,120,255,0.45)',
                  }}
                >
                  {r.icon}
                </span>
                <p className="font-bold text-[#1a0a2e] dark:text-white">{r.title}</p>
                <p className="text-sm leading-relaxed whitespace-pre-line text-[#1a0a2e]/60 dark:text-white/50">{r.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CASTING TIMELINE — editorial alternating layout ──────────── */}
      <section className="max-w-5xl mx-auto px-4 py-16 md:py-24">
        <motion.h3
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center font-black text-2xl mb-2 text-[#1a0a2e] dark:text-white"
        >
          So l&auml;uft das Casting ab
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm mb-14 text-[#1a0a2e]/50 dark:text-white/40"
        >
          Von der Bewerbung bis zum Shooting — alle Schritte auf einen Blick.
        </motion.p>

        <div className="relative">
          {/* Vertical connecting gradient line — desktop only */}
          <div
            className="hidden md:block absolute left-1/2 -translate-x-px top-8 bottom-8 w-px pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, transparent 0%, rgba(245,158,11,0.5) 10%, rgba(139,92,246,0.45) 28%, rgba(236,72,153,0.45) 46%, rgba(16,185,129,0.45) 64%, rgba(245,158,11,0.5) 82%, rgba(139,92,246,0.45) 95%, transparent 100%)',
            }}
          />

          <div className="space-y-6 md:space-y-0">
            {EDITORIAL_STEPS.map((step, i) => {
              const isLeft = i % 2 === 0
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, x: isLeft ? -24 : 24, y: 10 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="relative md:grid md:grid-cols-[1fr_80px_1fr] md:items-center md:mb-10"
                >
                  {/* ── Desktop: left slot ── */}
                  <div className="hidden md:block">
                    {isLeft && (
                      <div className="pr-7">
                        <div
                          className="relative rounded-2xl p-5 overflow-hidden"
                          style={{
                            background: 'var(--bg-card)',
                            backdropFilter: 'blur(16px)',
                            border: `1px solid ${step.color}28`,
                            boxShadow: step.isGolden
                              ? `0 0 32px rgba(245,158,11,0.18), 0 4px 20px rgba(245,158,11,0.10)`
                              : `0 4px 20px ${step.color}12`,
                          }}
                        >
                          {/* Watermark number */}
                          <span
                            className="absolute bottom-0 right-0 font-black leading-none select-none pointer-events-none"
                            style={{ fontSize: '7rem', color: step.color, opacity: 0.06 }}
                          >
                            {step.num}
                          </span>
                          <span
                            className="inline-block px-3 py-1 rounded-full text-[11px] font-bold text-white mb-3"
                            style={{ background: step.color }}
                          >
                            {step.date}
                          </span>
                          <h4 className="font-black text-sm tracking-wide mb-3 text-[#1a0a2e] dark:text-white uppercase">
                            {step.label}
                          </h4>
                          {renderStepContent(step)}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ── Desktop: center dot ── */}
                  <div className="hidden md:flex justify-center items-center">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm z-10 flex-shrink-0"
                      style={{
                        background: step.color,
                        boxShadow: `0 0 18px ${step.color}65`,
                      }}
                    >
                      {step.num}
                    </div>
                  </div>

                  {/* ── Desktop: right slot ── */}
                  <div className="hidden md:block">
                    {!isLeft && (
                      <div className="pl-7">
                        <div
                          className="relative rounded-2xl p-5 overflow-hidden"
                          style={{
                            background: 'var(--bg-card)',
                            backdropFilter: 'blur(16px)',
                            border: `1px solid ${step.color}28`,
                            boxShadow: `0 4px 20px ${step.color}12`,
                          }}
                        >
                          {/* Watermark number */}
                          <span
                            className="absolute bottom-0 left-0 font-black leading-none select-none pointer-events-none"
                            style={{ fontSize: '7rem', color: step.color, opacity: 0.06 }}
                          >
                            {step.num}
                          </span>
                          <span
                            className="inline-block px-3 py-1 rounded-full text-[11px] font-bold text-white mb-3"
                            style={{ background: step.color }}
                          >
                            {step.date}
                          </span>
                          <h4 className="font-black text-sm tracking-wide mb-3 text-[#1a0a2e] dark:text-white uppercase">
                            {step.label}
                          </h4>
                          {renderStepContent(step)}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ── Mobile: dot + card ── */}
                  <div className="md:hidden flex gap-3 items-start">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-xs flex-shrink-0"
                        style={{ background: step.color, boxShadow: `0 0 12px ${step.color}55` }}
                      >
                        {step.num}
                      </div>
                      {i < EDITORIAL_STEPS.length - 1 && (
                        <div
                          className="w-px mt-2"
                          style={{ background: `${step.color}35`, height: '100%', minHeight: '24px' }}
                        />
                      )}
                    </div>
                    <div
                      className="flex-1 relative rounded-2xl p-4 overflow-hidden mb-1"
                      style={{
                        background: 'var(--bg-card)',
                        backdropFilter: 'blur(16px)',
                        border: `1px solid ${step.color}28`,
                        boxShadow: step.isGolden
                          ? `0 0 20px rgba(245,158,11,0.15)`
                          : `0 4px 14px ${step.color}10`,
                      }}
                    >
                      <span
                        className="absolute bottom-0 right-0 font-black leading-none select-none pointer-events-none"
                        style={{ fontSize: '5rem', color: step.color, opacity: 0.05 }}
                      >
                        {step.num}
                      </span>
                      <span
                        className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white mb-2"
                        style={{ background: step.color }}
                      >
                        {step.date}
                      </span>
                      <h4 className="font-black text-xs tracking-wide mb-2 text-[#1a0a2e] dark:text-white uppercase">
                        {step.label}
                      </h4>
                      {renderStepContent(step)}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── WAS DU WISSEN MUSST ───────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl p-6 md:p-8"
          style={{
            background: 'rgba(139,92,246,0.08)',
            border: '1px solid rgba(139,92,246,0.25)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <h3
            className="text-xl font-black mb-6 text-center"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Was du wissen musst
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Mitmachen */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-3 text-[#1a0a2e]/60 dark:text-white/50">
                Mitmachen
              </p>
              <ul className="space-y-2">
                {REQUIREMENTS_LEFT.map((req) => (
                  <li key={req} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <span className="font-bold mt-0.5 flex-shrink-0" style={{ color: '#8B5CF6' }}>✓</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Das bekommst du */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-3 text-[#1a0a2e]/60 dark:text-white/50">
                Das bekommst du
              </p>
              <ul className="space-y-2">
                {REQUIREMENTS_RIGHT.map((item) => (
                  <li key={item.text} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <span className="flex-shrink-0">{item.emoji}</span>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  )
}
