'use client'

import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import type { Influencer } from '@/types'
import { getCategoryConfig } from '@/lib/config/categories'

interface VideoModalProps {
  influencer: Influencer | null
  onClose: () => void
  onVoteClick: (influencer: Influencer) => void
  campaignActive: boolean
}

function getEmbedUrl(url: string): { type: 'iframe' | 'video'; embedUrl: string } {
  // YouTube patterns
  const ytRegex =
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  const ytMatch = url.match(ytRegex)
  if (ytMatch) {
    const videoId = ytMatch[1]
    return {
      type: 'iframe',
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`,
    }
  }

  // Vimeo patterns
  const vimeoRegex = /(?:vimeo\.com\/)(\d+)/
  const vimeoMatch = url.match(vimeoRegex)
  if (vimeoMatch) {
    const videoId = vimeoMatch[1]
    return {
      type: 'iframe',
      embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1&title=0&byline=0&portrait=0`,
    }
  }

  // Supabase, S3 or direct video URL
  return { type: 'video', embedUrl: url }
}

export default function VideoModal({
  influencer,
  onClose,
  onVoteClick,
  campaignActive,
}: VideoModalProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme !== 'light'

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [handleKeyDown])

  if (!influencer) return null

  const { type, embedUrl } = getEmbedUrl(influencer.video_url)
  const cat = getCategoryConfig(influencer.category)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
        style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(14px)' }}
        onClick={onClose}
      >
        {/* Category glow pulse on entry */}
        {cat && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.18, 0] }}
            transition={{ duration: 1.6, ease: 'easeInOut' }}
            style={{
              background: `radial-gradient(ellipse at center, ${cat.primary}45 0%, transparent 70%)`,
            }}
          />
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 48 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 48 }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          className="w-full sm:max-w-3xl sm:rounded-2xl rounded-t-2xl overflow-hidden"
          style={{
            background: isDark ? 'rgba(12,0,22,0.94)' : 'rgba(255,255,255,0.94)',
            backdropFilter: 'blur(28px)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'}`,
            boxShadow: cat
              ? `0 32px 80px rgba(0,0,0,0.55), 0 0 80px ${cat.primary}28`
              : '0 32px 80px rgba(0,0,0,0.55)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Category gradient top bar */}
          {cat && (
            <div className="h-[3px] w-full flex-shrink-0" style={{ background: cat.gradient }} />
          )}

          {/* Header */}
          <div
            className="flex items-center justify-between p-4"
            style={{
              borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'}`,
            }}
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Creator avatar */}
              <div
                className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
                style={{ boxShadow: `0 0 0 2px ${cat?.primary ?? '#B478FF'}` }}
              >
                <Image
                  src={influencer.photo_url}
                  alt={influencer.name}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>

              {/* Name + handle */}
              <div className="min-w-0">
                <p
                  className="font-bold text-sm leading-tight truncate"
                  style={{ color: isDark ? '#fff' : '#1a0a2e' }}
                >
                  {influencer.name}
                </p>
                <p className="text-xs truncate" style={{ color: cat?.secondary ?? '#A78BFA' }}>
                  {influencer.handle}
                </p>
              </div>

              {/* Category badge — desktop only */}
              {cat && (
                <span
                  className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white flex-shrink-0 ml-1"
                  style={{ background: cat.gradient }}
                >
                  {cat.hashtag}
                </span>
              )}
            </div>

            {/* Header actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {campaignActive && (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    onClose()
                    setTimeout(() => onVoteClick(influencer), 100)
                  }}
                  className="hidden sm:flex px-4 py-2 rounded-full text-white text-sm font-bold"
                  style={{ background: cat?.gradient ?? 'linear-gradient(135deg, #B478FF, #FFD700)' }}
                >
                  Vote Now
                </motion.button>
              )}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)'}`,
                }}
                aria-label="Close"
              >
                <svg
                  className="w-4 h-4"
                  style={{ color: isDark ? '#fff' : '#1a0a2e' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Video — 16:9 */}
          <div className="relative bg-black" style={{ paddingBottom: '56.25%', height: 0 }}>
            {type === 'iframe' ? (
              <iframe
                src={embedUrl}
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={`${influencer.name} Video`}
              />
            ) : (
              <video
                src={embedUrl}
                className="absolute inset-0 w-full h-full bg-black"
                controls
                autoPlay
                playsInline
              />
            )}
          </div>

          {/* Footer — vote count + vote CTA */}
          <div
            className="p-4 flex items-center justify-between gap-4"
            style={{
              borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'}`,
            }}
          >
            {/* Vote count */}
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 flex-shrink-0" fill="#ef4444" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span
                className="text-sm font-bold"
                style={{ color: isDark ? '#fff' : '#1a0a2e' }}
              >
                {influencer.vote_count.toLocaleString('en-US')}
              </span>
              <span
                className="text-xs"
                style={{ color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(26,10,46,0.45)' }}
              >
                votes
              </span>
            </div>

            {/* Vote CTA — shown when active */}
            {campaignActive ? (
              <motion.button
                whileHover={{ scale: 1.04, filter: 'brightness(1.08)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  onClose()
                  setTimeout(() => onVoteClick(influencer), 100)
                }}
                className="px-5 py-2.5 rounded-full text-white text-sm font-bold"
                style={{
                  background: cat?.gradient ?? 'linear-gradient(135deg, #B478FF, #FFD700)',
                  boxShadow: cat ? `0 4px 20px ${cat.primary}40` : '0 4px 20px rgba(180,120,255,0.3)',
                }}
              >
                Vote for {influencer.name.split(' ')[0]}
              </motion.button>
            ) : (
              influencer.bio && (
                <p
                  className="text-xs leading-relaxed line-clamp-2 text-right"
                  style={{ color: isDark ? 'rgba(255,255,255,0.48)' : 'rgba(26,10,46,0.50)' }}
                >
                  {influencer.bio}
                </p>
              )
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
