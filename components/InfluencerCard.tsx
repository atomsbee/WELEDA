'use client'

import { memo, useState, useEffect } from 'react'
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
  const [mounted, setMounted] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  // Before mount, default to dark so SSR and first client render match
  const isDark = !mounted || resolvedTheme !== 'light'

  const cat = getCategoryConfig(influencer.category)

  const btnGradient = cat?.gradient
  const btnBg = cat?.primary ?? '#64748B'

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
          {/* Shimmer placeholder — fades out when image loads */}
          {!imageLoaded && (
            <div
              className="absolute inset-0 z-10"
              style={{
                background: `linear-gradient(135deg, ${cat?.primary ?? '#B478FF'}1A 0%, ${cat?.primary ?? '#B478FF'}08 50%, ${cat?.primary ?? '#B478FF'}1A 100%)`,
                backgroundSize: '200% 200%',
                animation: 'wSkeletonShimmer 1.6s ease-in-out infinite',
              }}
            />
          )}

          {imageError ? (
            /* Branded fallback — shows "W" in category color */
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-2"
              style={{ background: `linear-gradient(135deg, ${cat?.primary ?? '#B478FF'}18, ${cat?.primary ?? '#B478FF'}30)` }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center font-black text-xl"
                style={{
                  background: `${cat?.primary ?? '#B478FF'}30`,
                  color: cat?.primary ?? '#B478FF',
                  border: `2px solid ${cat?.primary ?? '#B478FF'}60`,
                }}
              >
                W
              </div>
              <p className="text-xs font-semibold" style={{ color: cat?.primary ?? '#B478FF' }}>
                WELEDA
              </p>
            </div>
          ) : (
            <Image
              src={influencer.photo_url}
              alt={influencer.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-cover transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmM2UyZmYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNmZmUyZjMiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgZmlsbD0idXJsKCNnKSIvPjwvc3ZnPg=="
              priority={priority}
              loading={priority ? 'eager' : 'lazy'}
              onLoad={() => setImageLoaded(true)}
              onError={() => { setImageLoaded(true); setImageError(true) }}
            />
          )}
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
            <div
              className="w-full h-full rounded-full flex items-center justify-center"
              style={{
                background: isDark ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(8px)',
                border: isDark
                  ? '1px solid rgba(255,255,255,0.5)'
                  : `1px solid ${cat?.primary ?? '#64748B'}40`,
              }}
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6 ml-0.5"
                fill={isDark ? 'white' : (cat?.primary ?? '#64748B')}
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
          <p className="text-xs md:text-sm font-medium" style={{ color: cat?.primary ?? '#A78BFA' }}>
            {influencer.handle}
          </p>
        </div>

        {/* Category hashtag — decorative pill, not clickable */}
        {cat && (
          <span
            className="text-[11px] font-semibold px-2.5 py-1 rounded-full pointer-events-none select-none self-start"
            style={{
              background: `${cat.primary}18`,
              border: `1px solid ${cat.primary}30`,
              color: cat.primary,
            }}
          >
            #weledafragrancemists
          </span>
        )}

        {/* Vote counter */}
        <div className="flex items-center gap-1.5 text-sm">
          <svg className="w-4 h-4 flex-shrink-0" fill="#ef4444" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <motion.span
            key={influencer.vote_count}
            initial={{ scale: 1.4, color: 'var(--text-primary)' }}
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
          className="mt-auto w-full py-2.5 rounded-full font-bold text-sm transition-shadow duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          style={
            campaignActive
              ? {
                background: btnGradient ?? btnBg,
                boxShadow: cat ? `0 4px 14px ${cat.primary}35` : undefined,
                color: '#ffffff',
              }
              : { background: 'var(--bg-chip)', color: 'var(--text-chip)' }
          }
        >
          {campaignActive ? 'JETZT ABSTIMMEN' : 'Voting Ended'}
        </motion.button>
      </div>
    </motion.div>
  )
}

export default memo(InfluencerCard)

