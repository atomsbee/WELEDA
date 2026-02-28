'use client'

import { useState, useMemo, useCallback, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import HeroSection from '@/components/HeroSection'
import SearchFilterBar, { type SortOption } from '@/components/SearchFilterBar'
import InfluencerCard from '@/components/InfluencerCard'
import VideoModal from '@/components/VideoModal'
import dynamic from 'next/dynamic'

const VoteModal = dynamic(() => import('@/components/VoteModal'), { ssr: false })
import type { Influencer } from '@/types'
import { CATEGORIES, CATEGORY_KEYS, type CategoryKey } from '@/lib/config/categories'

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
  const [activeCategory, setActiveCategory] = useState<CategoryKey | 'all'>('all')
  const [videoInfluencer, setVideoInfluencer] = useState<Influencer | null>(null)
  const [voteInfluencer, setVoteInfluencer] = useState<Influencer | null>(null)

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

    if (search.trim()) {
      const q = search.toLowerCase().trim()
      result = result.filter(
        (inf) =>
          inf.name.toLowerCase().includes(q) ||
          inf.handle.toLowerCase().includes(q) ||
          (inf.bio ?? '').toLowerCase().includes(q)
      )
    }

    if (activeHashtags.length > 0) {
      result = result.filter((inf) =>
        activeHashtags.some((tag) => (inf.hashtags ?? []).includes(tag))
      )
    }

    if (activeCategory !== 'all') {
      result = result.filter((inf) => inf.category === activeCategory)
    }

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
  }, [influencers, search, sort, activeHashtags, activeCategory])

  const handleVoteSuccess = useCallback((influencerId: string, newVoteCount?: number) => {
    setInfluencers((prev) =>
      prev.map((inf) => {
        if (inf.id !== influencerId) return inf
        return { ...inf, vote_count: newVoteCount ?? inf.vote_count + 1 }
      })
    )
  }, [])

  // Group by category for "all" view
  const groupedByCategory = useMemo(() => {
    if (activeCategory !== 'all') return null
    return CATEGORY_KEYS.map((key) => ({
      key,
      config: CATEGORIES[key],
      items: filteredInfluencers.filter((inf) => inf.category === key),
    })).filter((g) => g.items.length > 0)
  }, [filteredInfluencers, activeCategory])

  const hasAnyResults = filteredInfluencers.length > 0

  return (
    <>
      <HeroSection campaignActive={campaignActive} endDate={endDate} />

      <div id="influencer-grid" className="">
        <SearchFilterBar
          allHashtags={allHashtags}
          onFilterChange={handleFilterChange}
        />

        <section className="max-w-7xl mx-auto px-4 pt-16 md:pt-20 pb-24 md:pb-32">
          {/* Category filter strip */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <button
              onClick={() => setActiveCategory('all')}
              className="px-4 py-2 rounded-full text-sm font-bold transition-all duration-200"
              style={
                activeCategory === 'all'
                  ? {
                    background: 'linear-gradient(135deg, #7C3AED, #B478FF)',
                    border: '1px solid transparent',
                    boxShadow: '0 4px 14px rgba(180,120,255,0.35)',
                    color: '#fff',
                  }
                  : {
                    background: 'var(--bg-chip)',
                    border: '1px solid var(--border-chip)',
                    color: 'var(--text-chip)',
                  }
              }
            >
              All Categories
            </button>
            {CATEGORY_KEYS.map((key) => {
              const cat = CATEGORIES[key]
              const isActive = activeCategory === key
              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className="px-4 py-2 rounded-full text-sm font-bold transition-all duration-200"
                  style={{
                    background: isActive ? cat.gradient : 'var(--bg-chip)',
                    border: isActive ? '1px solid transparent' : `1px solid var(--border-chip)`,
                    color: isActive ? '#fff' : 'var(--text-chip)',
                    boxShadow: isActive ? `0 4px 14px ${cat.glow}` : undefined,
                  }}
                >
                  {cat.label}
                </button>
              )
            })}
          </div>

          {/* Results header */}
          <motion.div
            ref={gridHeaderRef}
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex items-center justify-between mb-10 md:mb-12"
          >
            <h2 className="text-lg font-bold text-[#1a0a2e] dark:text-white">
              {filteredInfluencers.length === influencers.length
                ? `${influencers.length} Creators`
                : `${filteredInfluencers.length} of ${influencers.length} Creators`}
            </h2>
            {!campaignActive && (
              <span
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  background: 'var(--bg-chip)',
                  border: '1px solid var(--border-chip)',
                  color: 'var(--text-muted)',
                }}
              >
                Voting Ended
              </span>
            )}
          </motion.div>

          {/* Grid — grouped by category in "all" view, flat otherwise */}
          {!hasAnyResults ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{
                  background: 'var(--bg-chip)',
                  border: '1px solid var(--border-chip)',
                }}
              >
                <svg className="w-7 h-7" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>No creators found</p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Try different search terms or filters.</p>
            </div>
          ) : groupedByCategory ? (
            // Grouped layout
            <div className="space-y-16 md:space-y-20">
              {groupedByCategory.map((group, groupIndex) => {
                const cat = group.config
                return (
                  <div key={group.key}>
                    {/* Section header — gradient divider with glass center pill */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4 }}
                      className="mb-8 md:mb-10"
                    >
                      <div className="flex items-center gap-4 mb-1.5">
                        {/* Left gradient fade line */}
                        <div
                          className="flex-1 h-px"
                          style={{ background: `linear-gradient(to right, transparent, ${cat.primary}55)` }}
                        />
                        {/* Center glass pill */}
                        <div
                          className="flex items-center gap-2 px-4 py-3 rounded-full flex-shrink-0"
                          style={{
                            background: 'var(--bg-card)',
                            border: `1px solid ${cat.primary}30`,
                            backdropFilter: 'blur(12px)',
                            boxShadow: `0 4px 16px ${cat.glow}`,
                          }}
                        >
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cat.gradient }} />
                          <h3 className="font-black text-base leading-none text-[#1a0a2e] dark:text-white">
                            {cat.label}
                          </h3>
                          <span
                            className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                            style={{ background: cat.gradient }}
                          >
                            {cat.hashtag}
                          </span>
                        </div>
                        {/* Right gradient fade line */}
                        <div
                          className="flex-1 h-px"
                          style={{ background: `linear-gradient(to left, transparent, ${cat.primary}55)` }}
                        />
                      </div>
                      <p className="text-center text-xs text-[#1a0a2e]/45 dark:text-white/40">
                        {cat.tagline}
                      </p>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6 lg:gap-7">
                      {group.items.map((influencer, index) => (
                        <motion.div
                          key={influencer.id}
                          initial={{ opacity: 0, y: 40, scale: 0.95 }}
                          whileInView={{ opacity: 1, y: 0, scale: 1 }}
                          viewport={{ once: true, margin: '-30px' }}
                          transition={{
                            duration: 0.45,
                            delay: Math.min(index * 0.06, 0.5),
                            ease: [0.25, 0.46, 0.45, 0.94],
                          }}
                        >
                          <InfluencerCard
                            influencer={influencer}
                            priority={groupIndex === 0 && index < 4}
                            campaignActive={campaignActive}
                            onVoteClick={(inf) => setVoteInfluencer(inf)}
                            onVideoClick={(inf) => setVideoInfluencer(inf)}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            // Flat layout (single category selected)
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6 lg:gap-7">
              {filteredInfluencers.map((influencer, index) => (
                <motion.div
                  key={influencer.id}
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={isHeaderInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{
                    duration: 0.5,
                    delay: Math.min(index * 0.07, 0.8),
                    ease: [0.25, 0.46, 0.45, 0.94],
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
              ))}
            </div>
          )}
        </section>
      </div>

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
