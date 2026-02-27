'use client'

import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import type { Influencer } from '@/types'

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

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
        style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ duration: 0.25 }}
          className="bg-gray-900 w-full sm:max-w-3xl sm:rounded-2xl rounded-t-2xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={influencer.photo_url}
                  alt={influencer.name}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div>
                <p className="font-bold text-white text-sm">{influencer.name}</p>
                <p className="text-xs" style={{ color: '#52B788' }}>
                  {influencer.handle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {campaignActive && (
                <button
                  onClick={() => {
                    onClose()
                    setTimeout(() => onVoteClick(influencer), 100)
                  }}
                  className="px-4 py-2 rounded-full bg-weleda-green text-white text-sm font-bold hover:bg-opacity-90 transition-colors"
                >
                  Vote Now
                </button>
              )}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Video */}
          <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
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

          {/* Footer with bio */}
          {influencer.bio && (
            <div className="p-4 border-t border-gray-800">
              <p className="text-gray-400 text-sm leading-relaxed">{influencer.bio}</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
