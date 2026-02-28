'use client'

import { memo } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import type { Influencer } from '@/types'
import { getCategoryConfig } from '@/lib/config/categories'

interface InfluencerCardProps {
  influencer: Influencer
  priority?: boolean
  campaignActive: boolean
  onVoteClick: (influencer: Influencer) => void
  onVideoClick: (influencer: Influencer) => void
}

function InfluencerCard({
  influencer,
  priority = false,
  campaignActive,
  onVoteClick,
  onVideoClick,
}: InfluencerCardProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme !== 'light'

  const cat = getCategoryConfig(influencer.category)

  const btnGradient = cat?.gradient
  const btnBg = cat?.primary ?? '#7C3AED'

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
      variants={{
        rest: { y: 0, scale: 1 },
        hover: { y: -8, scale: 1.02 },
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="rounded-2xl overflow-hidden flex flex-col cursor-pointer"
      style={{
        background: 'var(--bg-card)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--border-card)',
        boxShadow: cat
          ? `0 4px 30px ${cat.glow}`
          : '0 4px 30px rgba(180,120,255,0.1)',
      }}
    >

      {/* Photo + play overlay */}
      <div
        className="relative aspect-square overflow-hidden"
        onClick={() => onVideoClick(influencer)}
      >
        <motion.div
          className="absolute inset-0"
          variants={{ rest: { scale: 1 }, hover: { scale: 1.08 } }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Image
            src={influencer.photo_url}
            alt={influencer.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
          />
        </motion.div>

        {/* Hover dark overlay */}
        <motion.div
          className="absolute inset-0"
          style={{ background: 'rgba(0,0,0,0.35)' }}
          variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
          transition={{ duration: 0.2 }}
        />

        {/* Category badge — glass, theme-aware */}
        {cat && (
          <div
            className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold leading-none"
            style={{
              background: isDark ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.45)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${isDark ? `${cat.primary}40` : `${cat.primary}60`}`,
              color: '#fff',
            }}
          >
            {cat.hashtag}
          </div>
        )}

        {/* Play button — glass */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-12 h-12 md:w-14 md:h-14">
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ background: 'rgba(255,255,255,0.15)' }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div
              className="w-full h-full rounded-full flex items-center justify-center"
              style={{
                background: isDark ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(8px)',
                border: isDark
                  ? '1px solid rgba(255,255,255,0.5)'
                  : `1px solid ${cat?.primary ?? '#7C3AED'}40`,
              }}
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6 ml-0.5"
                fill={isDark ? 'white' : (cat?.primary ?? '#7C3AED')}
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Card body */}
      <div
        className="p-3 md:p-4 flex flex-col flex-1 gap-2"
        style={{ background: 'var(--bg-card-inner)' }}
      >
        {/* Name + handle */}
        <div>
          <button
            onClick={() => onVideoClick(influencer)}
            className="font-bold text-sm md:text-base hover:opacity-75 transition-opacity text-left line-clamp-1 w-full text-[#1a0a2e] dark:text-white"
          >
            {influencer.name}
          </button>
          <p className="text-xs md:text-sm font-medium" style={{ color: cat?.secondary ?? '#A78BFA' }}>
            {influencer.handle}
          </p>
        </div>

        {/* Hashtags */}
        {influencer.hashtags && influencer.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {influencer.hashtags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  color: 'var(--text-chip)',
                  background: 'var(--bg-chip)',
                  border: '1px solid var(--border-chip)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Vote counter */}
        <div className="flex items-center gap-1.5 text-sm">
          <svg className="w-4 h-4 flex-shrink-0" fill="#ef4444" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <motion.span
            key={influencer.vote_count}
            initial={{ scale: 1.4, color: '#B478FF' }}
            animate={{ scale: 1, color: 'var(--text-primary)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className="font-bold"
          >
            {influencer.vote_count.toLocaleString('en-US')}
          </motion.span>
          <span className="text-xs" style={{ color: 'var(--text-faint)' }}>votes</span>
        </div>

        {/* Vote button */}
        <motion.button
          whileHover={campaignActive ? { y: -1, filter: 'brightness(1.10)' } : {}}
          whileTap={{ scale: 0.97 }}
          onClick={() => campaignActive && onVoteClick(influencer)}
          disabled={!campaignActive}
          className="mt-auto w-full py-2.5 rounded-full font-bold text-sm transition-shadow duration-200 disabled:opacity-40 disabled:cursor-not-allowed text-white"
          style={
            campaignActive
              ? {
                background: btnGradient ?? btnBg,
                boxShadow: cat ? `0 4px 14px ${cat.primary}35` : undefined,
              }
              : { background: 'var(--bg-chip)' }
          }
        >
          {campaignActive ? 'Vote Now' : 'Voting Ended'}
        </motion.button>
      </div>
    </motion.div>
  )
}

export default memo(InfluencerCard)

// Skeleton loading card
export function InfluencerCardSkeleton() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-card)',
      }}
    >
      <div
        className="relative aspect-square overflow-hidden"
        style={{ background: 'var(--bg-chip)' }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)',
          }}
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <div className="p-4 space-y-3" style={{ background: 'var(--bg-card-inner)' }}>
        {[['w-3/4', 'h-4'], ['w-1/2', 'h-3'], ['w-1/3', 'h-3']].map(([w, h], i) => (
          <div
            key={i}
            className={`relative overflow-hidden ${h} ${w} rounded`}
            style={{ background: 'var(--bg-chip)' }}
          >
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
              }}
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: i * 0.1 }}
            />
          </div>
        ))}
        <div
          className="relative overflow-hidden h-10 rounded-full"
          style={{ background: 'var(--bg-chip)' }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
            }}
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 0.3 }}
          />
        </div>
      </div>
    </div>
  )
}
