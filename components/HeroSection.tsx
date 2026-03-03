'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { PRODUCT_IMAGE } from '@/lib/config/categories'
import type { CampaignPhase } from '@/lib/campaign'

// Spec-defined stagger sequence
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

interface HeroSectionProps {
  campaignPhase?: CampaignPhase
}

const JURY = [
  {
    name: 'Bene Schulz',
    handle: '@bene.schulz',
    image: '/img/bene-schulz.jpg',
    url: 'https://www.tiktok.com/@bene.schulz',
  },
  {
    name: 'Celine Bethmann',
    handle: '@celinebethmann',
    image: '/img/celine-bethmann.jpg',
    url: 'https://www.tiktok.com/@.celinebethmann',
  },
  {
    name: 'WoistLena',
    handle: '@woistlena',
    image: '/img/woistlena.jpg',
    url: 'https://www.tiktok.com/@woistlena',
  },
]

export default function HeroSection({ campaignPhase = 'pre' }: HeroSectionProps) {
  const shouldReduceMotion = useReducedMotion()
  const [heroImageLoaded, setHeroImageLoaded] = useState(false)

  const handleCta = useCallback(() => {
    const targetId = campaignPhase === 'voting' ? 'influencer-grid' : 'how-to-section'
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [campaignPhase])

  return (
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

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-12 w-container w-full">

        {/* Text block */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left flex-1 max-w-xl order-2 lg:order-1">

          {/* Gradient headline */}
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

          {/* Subhead */}
          <motion.p
            custom={4}
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            className="text-base leading-relaxed mb-4 max-w-xl"
            style={{ color: 'var(--text-secondary)' }}
          >
            Poste jetzt dein Casting-Video, sammle die Votes der Community, flieg mit uns ins große Finale nach Teneriffa und werde von der Jury Bene Schulz, Celine Bethmann und WoistLena zum neuen Gesicht der Weleda Sommerkampagne gekürt.
          </motion.p>

          {/* Date badges */}
          <motion.div
            custom={6}
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2">
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

          {/* ── Jury Section ── */}
          <motion.div
            custom={6.5}
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="mt-6 mb-6">
              <p
                className="text-[10px] font-black uppercase tracking-[0.2em] mb-3"
                style={{ color: 'var(--text-muted)' }}
              >
                Deine Jury
              </p>

              <div className="flex items-center gap-3">
                <div className="flex -space-x-2.5">
                  {JURY.map((member, i) => (
                    <a
                      key={member.name}
                      href={member.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={member.name}
                      className="relative block rounded-full ring-2 ring-white/80 hover:scale-110 hover:z-10 transition-transform duration-200"
                      style={{ zIndex: JURY.length - i }}
                    >
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </a>
                  ))}
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <svg
                      className="w-3 h-3 flex-shrink-0"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
                    </svg>
                    <p
                      className="text-xs font-bold leading-tight"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      Bene Schulz, Celine Bethmann & WoistLena
                    </p>
                  </div>
                  <p
                    className="text-[11px]"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Jury der WELEDA Summer Campaign
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div custom={7} variants={heroVariants} initial="hidden" animate="visible">
            <motion.button
              whileHover={shouldReduceMotion ? {} : { scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCta}
              className="relative overflow-hidden px-10 py-4 rounded-full font-bold text-sm tracking-widest uppercase"
              style={{
                background: 'linear-gradient(135deg, #B478FF 0%, #FFD700 0%, #FF6EB4 66%, #B478FF 100%)',
                color: '#ffffff',
              }}
            >
              <span
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)',
                  animation: 'shimmerSweep 2.8s ease infinite',
                }}
              />
              <span className="relative z-10 flex items-center gap-2">
                {campaignPhase === 'voting' ? 'JETZT ABSTIMMEN' : campaignPhase === 'ended' ? 'VOTING BEENDET' : 'JETZT BEWERBEN'}
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
  )
}
