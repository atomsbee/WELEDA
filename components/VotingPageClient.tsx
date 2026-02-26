'use client'

import { useState, useMemo, useCallback, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import HeroSection from '@/components/HeroSection'
import SearchFilterBar, { type SortOption } from '@/components/SearchFilterBar'
import InfluencerCard from '@/components/InfluencerCard'
import VideoModal from '@/components/VideoModal'
import VoteModal from '@/components/VoteModal'
import type { Influencer } from '@/types'

interface VotingPageClientProps {
  initialInfluencers: Influencer[]
  allHashtags: string[]
  campaignActive: boolean
  endDate: string | null
}

export default function VotingPageClient({
  initialInfluencers,
  allHashtags,
  campaignActive,
  endDate,
}: VotingPageClientProps) {
  const [influencers, setInfluencers] = useState<Influencer[]>(initialInfluencers)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOption>('display_order')
  const [activeHashtags, setActiveHashtags] = useState<string[]>([])
  const [videoInfluencer, setVideoInfluencer] = useState<Influencer | null>(null)
  const [voteInfluencer, setVoteInfluencer] = useState<Influencer | null>(null)

  // Scroll-triggered animation refs
  const gridHeaderRef = useRef(null)
  const isHeaderInView = useInView(gridHeaderRef, { once: true, margin: '-50px' })

  const handleFilterChange = useCallback(
    (newSearch: string, newSort: SortOption, newHashtags: string[]) => {
      setSearch(newSearch)
      setSort(newSort)
      setActiveHashtags(newHashtags)
    },
    []
  )

  const filteredInfluencers = useMemo(() => {
    let result = [...influencers]

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase().trim()
      result = result.filter(
        (inf) =>
          inf.name.toLowerCase().includes(q) ||
          inf.handle.toLowerCase().includes(q) ||
          (inf.bio ?? '').toLowerCase().includes(q)
      )
    }

    // Hashtag filter
    if (activeHashtags.length > 0) {
      result = result.filter((inf) =>
        activeHashtags.some((tag) => (inf.hashtags ?? []).includes(tag))
      )
    }

    // Sort
    switch (sort) {
      case 'display_order':
        result.sort((a, b) => a.display_order - b.display_order)
        break
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case 'alphabetical':
        result.sort((a, b) => a.name.localeCompare(b.name, 'en'))
        break
    }

    return result
  }, [influencers, search, sort, activeHashtags])

  // Update vote count after successful vote using server-returned count
  const handleVoteSuccess = useCallback((influencerId: string, newVoteCount?: number) => {
    setInfluencers((prev) =>
      prev.map((inf) => {
        if (inf.id !== influencerId) return inf
        return { ...inf, vote_count: newVoteCount ?? inf.vote_count + 1 }
      })
    )
  }, [])

  return (
    <>
      <HeroSection campaignActive={campaignActive} endDate={endDate} />

      <div id="influencer-grid" className="pt-4">
        <SearchFilterBar
          allHashtags={allHashtags}
          onFilterChange={handleFilterChange}
        />

        <section className="max-w-7xl mx-auto px-4 py-8">
          {/* Results count — scroll-triggered fade in */}
          <motion.div
            ref={gridHeaderRef}
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex items-center justify-between mb-6"
          >
            <h2 className="text-lg font-bold text-weleda-dark">
              {filteredInfluencers.length === influencers.length
                ? `${influencers.length} Creators`
                : `${filteredInfluencers.length} of ${influencers.length} Creators`}
            </h2>
            {!campaignActive && (
              <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-medium">
                Voting Ended
              </span>
            )}
          </motion.div>

          {/* Grid — staggered card entrance */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredInfluencers.length > 0 ? (
              filteredInfluencers.map((influencer, index) => (
                <motion.div
                  key={influencer.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: Math.min(index * 0.05, 0.6),
                    ease: 'easeOut',
                  }}
                >
                  <InfluencerCard
                    influencer={influencer}
                    priority={index < 8}
                    campaignActive={campaignActive}
                    onVoteClick={(inf) => setVoteInfluencer(inf)}
                    onVideoClick={(inf) => setVideoInfluencer(inf)}
                  />
                </motion.div>
              ))
            ) : (
              // Empty state
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-weleda-bg border border-weleda-card-border flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-weleda-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-weleda-dark font-semibold">No creators found</p>
                <p className="text-weleda-muted text-sm mt-1">Try different search terms or filters.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Video Modal */}
      {videoInfluencer && (
        <VideoModal
          influencer={videoInfluencer}
          onClose={() => setVideoInfluencer(null)}
          onVoteClick={(inf) => {
            setVideoInfluencer(null)
            setTimeout(() => setVoteInfluencer(inf), 100)
          }}
          campaignActive={campaignActive}
        />
      )}

      {/* Vote Modal */}
      {voteInfluencer && (
        <VoteModal
          influencer={voteInfluencer}
          onClose={() => setVoteInfluencer(null)}
          onVoteSuccess={handleVoteSuccess}
        />
      )}
    </>
  )
}
