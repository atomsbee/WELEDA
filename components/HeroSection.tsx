'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { CATEGORIES, PRODUCT_IMAGE, MARQUEE_ITEMS, CATEGORY_KEYS } from '@/lib/config/categories'

const VIDEO_SRC = 'https://weleda-voting-videos.s3.eu-central-1.amazonaws.com/video/videoplayback.mp4'
const VIDEO_POSTER = '/img/maxresdefault.jpg'

interface StepCard {
  num: number
  accent: string
  title: string
  body?: React.ReactNode
  items?: { icon: string; text: React.ReactNode }[]
}

const STEP_CARDS: StepCard[] = [
  {
    num: 1,
    accent: 'rgb(124,58,237)',
    title: 'Video erstellen',
    body: (
      <>
        Bewirb dich mit einem <strong>Video auf TikTok oder Instagram</strong> (mind. 30 Sek, max. 5 Min). Zeig, warum <strong>genau DU</strong> eines der drei neuen Faces unserer <strong>WELEDA Summer Body & Hair Mist Campaign</strong> werden solltest.
      </>
    ),
  },
  {
    num: 2,
    accent: 'rgb(244,114,182)',
    title: 'Produkt vorstellen',
    body: (
      <>
        Stell uns deine liebsten <strong>WELEDA Serum Booster Drops und/oder das UV Glow Fluid</strong> vor. Was feierst du daran? Wann benutzt du es? Warum passt es perfekt zu dir?
      </>
    ),
  },
  {
    num: 3,
    accent: 'rgb(251,191,36)',
    title: 'Wichtige Regeln',
    items: [
      { icon: '🎬', text: <>Lade dein Video als <strong>Feed-Post oder Reel auf TikTok oder Instagram</strong> hoch (keine Story)</> },
      { icon: '📍', text: 'Folge und markiere @weleda (IG & TikTok)' },
      { icon: '#️⃣', text: <><strong>#weledacasting #weledafragrancemists</strong></> },
    ],
  },
]

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
    chip: '02.03–12.03.2026',
    chipColor: '#F59E0B',
    title: 'Bewerbungsphase',
    body: 'Poste dein Bewerbungsvideo bis zum 12.3.2026 (24:00 Uhr) auf TikTok oder Instagram. Markiere @weleda und nutze den Hashtag',
    tags: ['#weledafragrancemists'],
    highlight: false,
  },
  {
    chip: 'TOP 10',
    chipColor: '#8B5CF6',
    title: 'Vorauswahl',
    body: 'Wir wählen die Top-Creators aus. Wenn du dabei bist bekommst du eine DM von uns. Überzeuge uns mit:',
    tags: ['Kreativität', 'Vibe', 'Know-How', 'Authentizität'],
    highlight: false,
  },
  {
    chip: '13.03–17.03.2026',
    chipColor: '#EC4899',
    title: 'Voting-Phase',
    body: '1\u00d7 t\u00e4glich abstimmen, 5 Tage lang. Mach ordentlich Werbung f\u00fcr dich!',
    tags: ['1\u00d7 t\u00e4glich', '5 Tage'],
    highlight: false,
  },
  {
    chip: '9 TICKETS',
    chipColor: '#10B981',
    title: 'Finale-Tickets',
    body: (
      <>
        6 x Top-Votes Category “Creator”<br />
        1 x Category “Community”<br />
        2 x Wildcard von WELEDA
      </>
    ),
    tags: ['Wildcard', 'Community Vote'],
    highlight: false,
  },
  {
    chip: '22.03–25.03.2026',
    chipColor: '#F59E0B',
    title: 'Teneriffa \uD83C\uDF34',
    body: 'Spannende Challenges, kreativer Content und echte Summer Vibes. Am Ende entscheidet die Jury, wer die drei Gesichter unserer neuen Fragrance Body & Hair Mists werden',
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
  '18–35 Jahre alt',
  'Wohnsitz in DE, AT oder CH',
  'Öffentliches Instagram oder TikTok Profil',
  'Video als Feed-Post oder Reel (keine Story)',
  '@weleda markieren',
  '#weledacasting, #weledafragrancemists nutzen',
  'Vom 22.03.2026–26.03.2026 verfügbar sein',
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
  const [heroImageLoaded, setHeroImageLoaded] = useState(false)
  const playerRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [hasEnded, setHasEnded] = useState(false)
  const [played, setPlayed] = useState(0)       // 0–1 fraction
  const [duration, setDuration] = useState(0)   // seconds
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [seeking, setSeeking] = useState(false)

  const formatTime = (s: number) => {
    if (!s || !isFinite(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const handleTimeUpdate = useCallback(() => {
    const v = playerRef.current
    if (!v || !v.duration || seeking) return
    setPlayed(v.currentTime / v.duration)
  }, [seeking])

  const handleSeekMouseDown = useCallback(() => setSeeking(true), [])
  const handleSeekChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayed(parseFloat(e.target.value))
  }, [])
  const handleSeekMouseUp = useCallback((e: React.MouseEvent<HTMLInputElement>) => {
    setSeeking(false)
    const v = playerRef.current
    if (v && v.duration) v.currentTime = parseFloat((e.target as HTMLInputElement).value) * v.duration
  }, [])

  const handleVolume = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value)
    setVolume(v)
    setIsMuted(v === 0)
  }, [])
  const handleMuteToggle = useCallback(() => setIsMuted(m => !m), [])

  // Sync play/pause state with native video element
  useEffect(() => {
    const v = playerRef.current
    if (!v) return
    if (isPlaying) {
      v.play().catch(() => setIsPlaying(false))
    } else {
      v.pause()
    }
  }, [isPlaying])

  // Sync volume
  useEffect(() => {
    const v = playerRef.current
    if (v) v.volume = volume
  }, [volume])

  // Sync mute
  useEffect(() => {
    const v = playerRef.current
    if (v) v.muted = isMuted
  }, [isMuted])

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

          {/* Text block — below image on mobile, left on desktop */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left flex-1 max-w-xl order-2 lg:order-1">

            {/* Campaign badge */}
            {/* <motion.div custom={1} variants={heroVariants} initial="hidden" animate="visible" className="mb-5">
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
            </motion.div> */}

            {/* Gradient headline — 3 lines */}
            <motion.h1
              custom={2}
              variants={heroVariants}
              initial="hidden"
              animate="visible"
              className="font-black leading-none mb-3"
              style={{ fontSize: 'clamp(2.6rem, 7vw, 5rem)', letterSpacing: '-0.02em' }}
            >
              <span
                style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #FFB6E8 0%, #B478FF 35%, #FFD700 65%, #FF6EB4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Dein Duft.<br />Dein Face.
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
                Dein WELEDA Sommer ✦
              </span>
            </motion.h1>

            {/* Category pills */}
            {/* <motion.p
              custom={3}
              variants={heroVariants}
              initial="hidden"
              animate="visible"
              className="text-sm md:text-base font-bold mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 justify-center lg:justify-start"
            >
              {CATEGORY_KEYS.map((key, i) => (
                <Fragment key={key}>
                  {i > 0 && <span style={{ color: 'var(--text-faint)' }}>·</span>}
                  <span style={{ color: CATEGORIES[key].primary }}>{CATEGORIES[key].label}</span>
                </Fragment>
              ))}
            </motion.p> */}

            {/* Subhead */}
            <motion.p
              custom={4}
              variants={heroVariants}
              initial="hidden"
              animate="visible"
              className="text-base leading-relaxed mb-2 max-w-md"
              style={{ color: 'var(--text-secondary)' }}
            >
              Poste jetzt dein Casting-Video, sammle die Votes der Community, flieg mit uns ins große Finale nach Teneriffa und werde von der Jury Bene Schulz, Celine Bethmann und WoistLena zum neuen Gesicht der Weleda Sommerkampagne gekürt.
            </motion.p>

            {/* Divider + Date badges */}
            <motion.div
              custom={6}
              variants={heroVariants}
              initial="hidden"
              animate="visible"
            >

              {/* Date badges */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 mb-8">
                {/* Badge 1 — Bewerbungsphase */}
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold w-fit"
                  style={{
                    background: 'rgba(251,191,36,0.15)',
                    border: '1px solid rgba(251,191,36,0.35)',
                    color: '#FBBF24',
                  }}
                >
                  Bewerbungsphase: 2.3.2026 – 12.3.2026
                </div>

                {/* Badge 2 — Voting-Phase */}
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold w-fit"
                  style={{
                    background: 'rgba(244,114,182,0.15)',
                    border: '1px solid rgba(244,114,182,0.35)',
                    color: '#F472B6',
                  }}
                >
                  Voting-Phase: 13.3.2026 – 17.3.2026
                </div>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div custom={7} variants={heroVariants} initial="hidden" animate="visible">
              <motion.button
                whileHover={shouldReduceMotion ? {} : { scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={scrollToGrid}
                className="relative overflow-hidden px-10 py-4 rounded-full font-bold text-sm tracking-widest uppercase"
                style={{
                  background: 'linear-gradient(135deg, #B478FF 0%, #FFD700 0%, #FF6EB4 66%, #B478FF 100%)',
                  color: '#ffffff',
                }}
              >
                {/* Shimmer sweep */}
                <span
                  className="pointer-events-none absolute inset-0 rounded-full"
                  style={{
                    background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)',
                    animation: 'shimmerSweep 2.8s ease infinite',
                  }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  JETZT ABSTIMMEN
                  <span>→</span>
                </span>
              </motion.button>
            </motion.div>
          </div>

          {/* Product image — top on mobile, right on desktop */}
          <motion.div
            custom={5}
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            className="relative flex-shrink-0 order-1 lg:order-2 w-full flex justify-center lg:block lg:w-auto"
          >
            <div
              className="relative w-full aspect-square lg:aspect-auto lg:w-[28rem] lg:h-[28rem] xl:w-[32rem] xl:h-[32rem] rounded-3xl overflow-hidden"
              style={{
                background: 'var(--bg-card)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--border-card)',
              }}
            >
              {/* Shimmer placeholder — fades out when image loads */}
              {!heroImageLoaded && (
                <div
                  className="absolute inset-0 z-10"
                  style={{
                    background: `linear-gradient(
                      135deg,
                      rgba(244,114,182,0.25) 0%,
                      rgba(139,92,246,0.20) 50%,
                      rgba(96,165,250,0.20) 100%
                    )`,
                    backgroundSize: '200% 200%',
                    animation: 'wSkeletonShimmer 2s ease-in-out infinite',
                  }}
                />
              )}
              {/* Subtle inner border glow */}
              <div
                className="absolute inset-0 rounded-2xl md:rounded-3xl pointer-events-none z-10"
                style={{
                  boxShadow: `
                    inset 0 0 0 1px rgba(255,255,255,0.12),
                    0 0 40px rgba(139,92,246,0.25),
                    0 0 80px rgba(244,114,182,0.15)
                  `,
                }}
              />

              <Image
                src={PRODUCT_IMAGE}
                alt="WELEDA Summer Collection"
                fill
                className={`object-cover transition-opacity duration-700 ${heroImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 448px, 512px"
                priority
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmY2U3ZjMiLz48c3RvcCBvZmZzZXQ9IjUwJSIgc3RvcC1jb2xvcj0iI2VkZTlmZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2RiZWFmZSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+"
                onLoad={() => setHeroImageLoaded(true)}
              />
            </div>

            {/* Glow behind image — tri-color gradient bleeding around the frame */}
            <div
              className="absolute inset-0 -z-10 opacity-50 rounded-3xl pointer-events-none"
              style={{
                background: `linear-gradient(
                  135deg,
                  rgba(244,114,182,0.6) 0%,
                  rgba(139,92,246,0.5) 40%,
                  rgba(96,165,250,0.4) 100%
                )`,
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

      {/* ── HOW-TO: 3 ACTS ──────────────────────────────────────────── */}
      <div className="py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto space-y-12 md:space-y-16">

          {/* ── STEP CARDS ────────────────────────────────────── */}
          <div>
            {/* Asymmetric header */}
            <div className="flex flex-col md:items-center md:justify-center mb-10 md:mb-14">
              <p
                className="text-xs font-bold tracking-[0.25em] uppercase mb-3"
                style={{ color: 'var(--text-faint)' }}
              >
                Deine Steps zum Finale
              </p>
              <h2
                className="text-4xl md:text-4xl font-black leading-none tracking-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                Und so{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #F472B6, #7C3AED)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  geht's.
                </span>
              </h2>
              <p
                className="hidden md:block text-sm leading-relaxed text-right flex-shrink-0 mt-3"
                style={{ color: 'var(--text-secondary)' }}
              >
                Poste dein Bewerbungsvideo, überzeuge uns und die Community — und flieg mit uns nach Teneriffa.
              </p>
            </div>

            {/* 2 × 2 card grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Cards 1 – 3 */}
              {STEP_CARDS.map((card) => (
                <div
                  key={card.num}
                  className="relative rounded-2xl p-7 md:p-8 overflow-hidden
                             hover:-translate-y-1 transition-transform duration-300"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-card)',
                  }}
                >
                  {/* Ghost number watermark */}
                  <span
                    className="absolute top-4 right-6 font-black select-none pointer-events-none"
                    style={{ fontSize: '80px', lineHeight: 1, opacity: 0.06, color: card.accent }}
                    aria-hidden="true"
                  >
                    {card.num}
                  </span>

                  {/* Step label */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: card.accent }} />
                    <p className="text-xs font-black uppercase tracking-widest" style={{ color: card.accent }}>
                      Schritt {card.num}
                    </p>
                  </div>

                  <h3 className="font-black text-xl mb-3" style={{ color: 'var(--text-primary)' }}>
                    {card.title}
                  </h3>

                  {card.items ? (
                    <ul className="space-y-3">
                      {card.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="text-base flex-shrink-0 mt-0.5">{item.icon}</span>
                          <span className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            {item.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {card.body}
                    </p>
                  )}
                </div>
              ))}

              {/* Card 4 — CTA + availability (no ghost number) */}
              <div
                className="relative rounded-2xl p-7 md:p-8 overflow-hidden
                           hover:-translate-y-1 transition-transform duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.10), rgba(244,114,182,0.07))',
                  border: '1px solid rgba(124,58,237,0.20)',
                }}
              >
                <p
                  className="text-2xl md:text-3xl font-black mb-5 leading-tight"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Let's go – wir wollen DICH sehen 💚
                </p>
                <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
                  Mit deiner Teilnahme garantierst du uns, dass du vom{' '}
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                    22.03.2026 – 26.03.2026
                  </span>{' '}
                  für das Live-Casting und die mögl. anschließende Produktion zur Verfügung stehst.
                </p>
                <Link
                  href="/nutzungsbedingungen"
                  className="inline-flex items-center gap-1 text-sm font-semibold
                             underline underline-offset-2 hover:opacity-70 transition-opacity"
                  style={{ color: 'rgb(124,58,237)' }}
                >
                  Alle Teilnahmebedingungen →
                </Link>
              </div>

            </div>
          </div>

          {/* ── VIDEO EMBED ───────────────────────────────────── */}
          <div
            className="relative w-full rounded-2xl overflow-hidden group/video"
            style={{ aspectRatio: '16/9' }}
          >
            {/* Native HTML5 video */}
            <div className="absolute inset-0">
              <video
                ref={playerRef}
                src={VIDEO_SRC}
                playsInline
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={() => {
                  if (playerRef.current) setDuration(playerRef.current.duration)
                }}
                onEnded={() => { setIsPlaying(false); setHasEnded(true); setPlayed(0) }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Poster + play button — shown before first play OR after video ends */}
            {(!hasStarted || hasEnded) && (
              <div
                className="absolute inset-0 cursor-pointer group z-[3]"
                onClick={() => {
                  setHasStarted(true)
                  setHasEnded(false)
                  setPlayed(0)
                  const v = playerRef.current
                  if (v) v.currentTime = 0
                  setIsPlaying(true)
                }}
              >
                <Image
                  src={VIDEO_POSTER}
                  alt="WELEDA Erklärvideo"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 1200px"
                />
                <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.28)' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center
                               group-hover:scale-110 transition-transform duration-200"
                    style={{
                      background: 'rgba(255,255,255,0.18)',
                      border: '2px solid rgba(255,255,255,0.55)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <svg className="w-8 h-8 ml-1.5" fill="white" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Click anywhere on video to toggle play/pause + centered play button when paused */}
            {hasStarted && !hasEnded && (
              <div
                className="absolute inset-0 cursor-pointer z-[1] flex items-center justify-center"
                onClick={() => setIsPlaying(p => !p)}
              >
                {!isPlaying && (
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center
                               transition-transform duration-200 hover:scale-110"
                    style={{
                      background: 'rgba(0,0,0,0.45)',
                      border: '2px solid rgba(255,255,255,0.55)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <svg className="w-8 h-8 ml-1.5" fill="white" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                )}
              </div>
            )}

            {/* Custom control bar — visible when video has started and not ended */}
            {hasStarted && !hasEnded && (
              <div
                className={`absolute bottom-0 left-0 right-0 z-[2] transition-opacity duration-200 ${
                  isPlaying ? 'opacity-0 group-hover/video:opacity-100' : 'opacity-100'
                }`}
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
                  paddingBottom: '14px',
                }}
              >
                {/* Seek bar — fraction 0–1, no NaN issues */}
                <div className="px-4 pb-2 pt-8">
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.001}
                    value={played}
                    onMouseDown={handleSeekMouseDown}
                    onTouchStart={handleSeekMouseDown}
                    onChange={handleSeekChange}
                    onMouseUp={handleSeekMouseUp}
                    onTouchEnd={() => {
                      setSeeking(false)
                      const v = playerRef.current
                      if (v && v.duration) v.currentTime = played * v.duration
                    }}
                    className="w-full cursor-pointer appearance-none"
                    style={{ accentColor: '#B478FF', height: '4px' }}
                  />
                </div>

                {/* Bottom row */}
                <div className="px-4 flex items-center gap-3">

                  {/* Play / Pause toggle */}
                  <button
                    onClick={() => setIsPlaying(p => !p)}
                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center
                               hover:scale-110 transition-transform duration-150"
                  >
                    {isPlaying ? (
                      <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>

                  {/* Time — played fraction × duration */}
                  <span className="text-white text-xs font-mono flex-shrink-0 tabular-nums">
                    {formatTime(played * duration)} / {formatTime(duration)}
                  </span>

                  <div className="flex-1" />

                  {/* Mute toggle */}
                  <button
                    onClick={handleMuteToggle}
                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center
                               hover:scale-110 transition-transform duration-150"
                  >
                    {isMuted || volume === 0 ? (
                      <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                      </svg>
                    ) : volume < 0.5 ? (
                      <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                        <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                      </svg>
                    )}
                  </button>

                  {/* Volume slider */}
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolume}
                    className="w-20 cursor-pointer appearance-none flex-shrink-0"
                    style={{ accentColor: '#B478FF', height: '4px' }}
                  />

                  {/* Fullscreen */}
                  <button
                    onClick={() => {
                      const container = playerRef.current?.parentElement?.parentElement
                      if (!container) return
                      if (document.fullscreenElement) {
                        document.exitFullscreen()
                      } else {
                        container.requestFullscreen()
                      }
                    }}
                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center
                               hover:scale-110 transition-transform duration-150 ml-1"
                  >
                    <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                      <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

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
          <h2
            className="w-reveal w-d0 text-3xl md:text-5xl font-black"
            data-animation="fade-up"
            style={{ color: 'var(--text-primary)' }}
          >
            So läuft das Casting ab
          </h2>
          <p className="text-base mt-3" style={{ color: 'var(--text-muted)' }}>
            Von der Bewerbung bis zum Shooting &mdash; alle Schritte auf einen Blick.
          </p>
        </div>

        {/* Desktop / Tablet: always 6 cols, horizontal scroll on narrow md */}
        <div className="hidden lg:block">
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

              <div className="grid grid-cols-6 gap-2 xl:gap-3 pt-8">
                {STEPS.map((step, i) => (
                  <div
                    key={i}
                    className={`w-reveal w-d${i + 1}`}
                    data-animation="fade-up"
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
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: compact vertical list */}
        <div className="lg:hidden max-w-lg mx-auto">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className={`w-reveal w-d${i + 1} flex gap-4 pb-6 relative`}
              data-animation="fade-up"
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
            </div>
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
          <h3
            className="w-reveal w-d0 text-center text-3xl font-black mb-10"
            data-animation="fade-up"
            style={{ color: 'var(--text-primary)' }}
          >
            Was du wissen musst
          </h3>

          <div className="grid md:grid-cols-2 gap-5">

            {/* LEFT CARD — clean checklist */}
            <div
              className="w-reveal w-d1 rounded-3xl p-7"
              data-animation="fade-left"
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
            </div>

            {/* RIGHT CARD — premium benefits */}
            <div
              className="w-reveal w-d2 rounded-3xl p-7 relative overflow-hidden"
              data-animation="fade-right"
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
            </div>

          </div>
        </div>
      </section>

      {/* ── CATEGORY MODEL CARDS ─────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2
          className="w-reveal w-d0 text-center text-2xl md:text-3xl font-black mb-2"
          data-animation="fade-up"
          style={{ color: 'var(--text-primary)' }}
        >
          Wähle Deine Duftwelt
        </h2>
        <p
          className="w-reveal w-d1 text-center text-sm mb-10"
          data-animation="fade-up"
          style={{ color: 'var(--text-muted)' }}
        >
          Eine Stimme pro Kategorie - Entdecke alle Drei und vote für deinen Favoriten
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {CATEGORY_KEYS.map((key, i) => {
            const cat = CATEGORIES[key]
            return (
              <div
                key={key}
                className={`w-reveal w-d${i + 1}`}
                data-animation="fade-up"
              >
                <motion.div
                  whileHover={shouldReduceMotion ? {} : { y: -8, scale: 1.02 }}
                  className="relative rounded-2xl overflow-hidden cursor-pointer group"
                  onClick={scrollToGrid}
                  style={{
                    background: 'var(--bg-card)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid var(--border-card)',
                    boxShadow: `0 0 40px ${cat.glow}`,
                    transition: 'box-shadow 0.3s',
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
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-black text-md leading-tight mb-2"
                      style={{ background: cat.gradient, color: 'white' }}
                    >
                      {cat.hashtag}
                    </div>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: 'rgba(255,255,255,0.70)', textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}
                    >
                      {cat.tagline}
                    </p>
                  </div>
                </motion.div>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}
