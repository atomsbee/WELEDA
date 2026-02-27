'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Influencer } from '@/types'

interface InfluencerCardProps {
  influencer: Influencer
  priority?: boolean
  campaignActive: boolean
  onVoteClick: (influencer: Influencer) => void
  onVideoClick: (influencer: Influencer) => void
}

export default function InfluencerCard({
  influencer,
  priority = false,
  campaignActive,
  onVoteClick,
  onVideoClick,
}: InfluencerCardProps) {
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
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-300 flex flex-col border border-weleda-card-border cursor-pointer"
    >
      {/* Photo + play overlay */}
      <div
        className="relative aspect-square overflow-hidden"
        onClick={() => onVideoClick(influencer)}
      >
        {/* Image — zooms on card hover */}
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

        {/* Dark overlay — fades in on hover */}
        <motion.div
          className="absolute inset-0 bg-black/30"
          variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
          transition={{ duration: 0.2 }}
        />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-12 h-12 md:w-14 md:h-14">
            {/* Pulse ring */}
            <motion.div
              className="absolute inset-0 rounded-full bg-white/20 pointer-events-none"
              animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ willChange: 'transform, opacity' }}
            />
            {/* Button circle — scales up on hover */}
            <motion.div
              className="w-full h-full rounded-full flex items-center justify-center shadow-lg bg-black/70"
              variants={{ hover: { scale: 1.1, backgroundColor: 'rgba(82,183,136,1)' } }}
              transition={{ duration: 0.2 }}
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6 text-white ml-0.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="p-3 md:p-4 flex flex-col flex-1 gap-2">
        {/* Name + handle */}
        <div>
          <button
            onClick={() => onVideoClick(influencer)}
            className="font-bold text-sm md:text-base text-weleda-dark hover:text-weleda-green transition-colors text-left line-clamp-1 w-full"
          >
            {influencer.name}
          </button>
          <p className="text-xs md:text-sm font-medium" style={{ color: '#52B788' }}>
            {influencer.handle}
          </p>
        </div>

        {/* Hashtags */}
        {influencer.hashtags && influencer.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {influencer.hashtags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-weleda-bg text-weleda-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Vote counter — pops on count change */}
        <div className="flex items-center gap-1.5 text-sm">
          <svg className="w-4 h-4 flex-shrink-0" fill="#ef4444" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <motion.span
            key={influencer.vote_count}
            initial={{ scale: 1.4, color: '#0b4535' }}
            animate={{ scale: 1, color: 'inherit' }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className="font-bold text-weleda-dark"
          >
            {influencer.vote_count.toLocaleString('en-US')}
          </motion.span>
          <span className="text-weleda-muted text-xs">votes</span>
        </div>

        {/* Vote button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => campaignActive && onVoteClick(influencer)}
          disabled={!campaignActive}
          className={`mt-auto w-full py-2.5 rounded-full font-bold text-sm transition-all duration-200 ${
            campaignActive
              ? 'bg-weleda-green text-white hover:bg-[#0b4535] shadow-sm hover:shadow-md'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {campaignActive ? 'Vote Now' : 'Voting Ended'}
        </motion.button>
      </div>
    </motion.div>
  )
}

// Skeleton loading card with shimmer
export function InfluencerCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-weleda-card-border">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <div className="p-4 space-y-3">
        {[['w-3/4', 'h-4'], ['w-1/2', 'h-3'], ['w-1/3', 'h-3']].map(([w, h], i) => (
          <div key={i} className={`relative overflow-hidden ${h} ${w} bg-gray-100 rounded`}>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: i * 0.1 }}
            />
          </div>
        ))}
        <div className="relative overflow-hidden h-10 bg-gray-100 rounded-full">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 0.3 }}
          />
        </div>
      </div>
    </div>
  )
}
