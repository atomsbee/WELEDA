'use client'

import { useState, useMemo, useCallback, useRef } from 'react'
import HeroSection from '@/components/HeroSection'
import InfluencerCard from '@/components/InfluencerCard'
import { InfluencerGridSkeleton } from '@/components/InfluencerCardSkeleton'
import VideoModal from '@/components/VideoModal'
import dynamic from 'next/dynamic'
import { useRevealAnimation } from '@/hooks/useRevealAnimation'

const VoteModal = dynamic(() => import('@/components/VoteModal'), { ssr: false })
import type { Influencer } from '@/types'
import { CATEGORIES, CATEGORY_KEYS, type CategoryKey } from '@/lib/config/categories'

interface VotingPageClientProps {
  initialInfluencers: Influencer[]
  campaignActive: boolean
  endDate: string | null
}

export default function VotingPageClient({
  initialInfluencers,
  campaignActive,
  endDate,
}: VotingPageClientProps) {
  const [influencers, setInfluencers] = useState<Influencer[]>(initialInfluencers)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<CategoryKey | 'all'>('all')
  const [videoInfluencer, setVideoInfluencer] = useState<Influencer | null>(null)
  const [voteInfluencer, setVoteInfluencer] = useState<Influencer | null>(null)
  const [searchFocused, setSearchFocused] = useState(false)

  const gridRef = useRef<HTMLDivElement>(null)
  useRevealAnimation()

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

    if (activeCategory !== 'all') {
      result = result.filter((inf) => inf.category === activeCategory)
    }

    return result
  }, [influencers, search, activeCategory])

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

        {/* ── COMPACT STICKY FILTER BAR ──────────────────────────────── */}
        <div
          className="sticky top-[60px] md:top-[72px] z-30 border-b"
          style={{
            background: 'var(--bg-filter)',
            backdropFilter: 'blur(16px)',
            borderColor: 'var(--border-nav)',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
            {/* Mobile: pills row + search row stacked; sm+: single row side-by-side */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">

              {/* Category pills — scrollable strip */}
              <div className="flex-1 overflow-x-auto scrollbar-hide min-w-0">
                <div className="flex items-center gap-1.5 min-w-max">
                  <button
                    onClick={() => setActiveCategory('all')}
                    className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200"
                    style={{
                      background: activeCategory === 'all'
                        ? 'linear-gradient(135deg, rgba(139,92,246,0.85), rgba(236,72,153,0.75))'
                        : 'var(--bg-chip)',
                      color: activeCategory === 'all' ? '#fff' : 'var(--text-chip)',
                      border: activeCategory === 'all'
                        ? '1px solid transparent'
                        : '1px solid var(--border-chip)',
                    }}
                  >
                    ✨ Alle
                  </button>
                  {CATEGORY_KEYS.map((key) => {
                    const cat = CATEGORIES[key]
                    const isActive = activeCategory === key
                    return (
                      <button
                        key={key}
                        onClick={() => setActiveCategory(key)}
                        className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200"
                        style={{
                          background: isActive ? cat.primary : 'var(--bg-chip)',
                          color: isActive ? '#fff' : 'var(--text-chip)',
                          border: isActive
                            ? `1px solid ${cat.primary}`
                            : '1px solid var(--border-chip)',
                        }}
                      >
                        {cat.hashtag}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Search — full width on mobile, constrained on sm+ */}
              <div className="relative w-full sm:flex-shrink-0 sm:w-52 md:w-64">
                <svg
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
                  style={{ color: searchFocused ? 'rgba(139,92,246,0.7)' : 'var(--text-muted)' }}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Creator suchen..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl text-sm outline-none transition-all duration-150"
                  style={{
                    background: 'var(--bg-input)',
                    border: searchFocused
                      ? '1px solid rgba(139,92,246,0.55)'
                      : '1px solid var(--border-input)',
                    boxShadow: searchFocused
                      ? '0 0 0 3px rgba(139,92,246,0.12)'
                      : 'none',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <section className="max-w-7xl mx-auto px-4 pt-10 pb-24 md:pb-32">
          {/* Grid anchor */}
          <div ref={gridRef} />

          {/* Grid — grouped by category in "all" view, flat otherwise */}
          {influencers.length === 0 ? (
            // SSR fetch returned empty — show skeleton until data loads
            <InfluencerGridSkeleton />
          ) : !hasAnyResults ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-4xl mb-4">🔍</p>
              <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Keine Creator gefunden</p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Versuche andere Suchbegriffe oder Filter.</p>
            </div>
          ) : groupedByCategory ? (
            // Grouped layout
            <div className="space-y-16 md:space-y-20">
              {groupedByCategory.map((group, groupIndex) => {
                const cat = group.config
                return (
                  <div key={group.key}>
                    {/* Section header — gradient divider with glass center pill */}
                    <div className="w-reveal w-d0 mb-8 md:mb-10" data-animation="fade-up">
                      <div className="flex items-center gap-4 mb-1.5">
                        <div
                          className="flex-1 h-px"
                          style={{ background: `linear-gradient(to right, transparent, ${cat.primary}55)` }}
                        />
                        <div
                          className="flex items-center gap-2 px-1 py-1 rounded-full flex-shrink-0"
                          style={{
                            background: 'var(--bg-card)',
                            border: `1px solid ${cat.primary}30`,
                            backdropFilter: 'blur(12px)',
                            boxShadow: `0 4px 16px ${cat.glow}`,
                          }}
                        >
                          <h3 className="font-black text-base leading-none px-3 py-2 rounded-full" style={{ background: cat.gradient, color: '#ffffff' }}>
                            {cat.hashtag}
                          </h3>
                        </div>
                        <div
                          className="flex-1 h-px"
                          style={{ background: `linear-gradient(to left, transparent, ${cat.primary}55)` }}
                        />
                      </div>
                      <p className="text-center text-xs" style={{ color: 'var(--text-faint)' }}>
                        {cat.tagline}
                      </p>
                    </div>

                    <div
                      className="w-reveal w-d1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6 lg:gap-7"
                      data-animation="fade-up"
                    >
                      {group.items.map((influencer, index) => (
                        <div key={influencer.id}>
                          <InfluencerCard
                            influencer={influencer}
                            priority={groupIndex === 0 && index < 4}
                            campaignActive={campaignActive}
                            onVoteClick={(inf) => setVoteInfluencer(inf)}
                            onVideoClick={(inf) => setVideoInfluencer(inf)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            // Flat layout (single category or search active)
            <div
              key={activeCategory + search}
              className="w-reveal w-d0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6 lg:gap-7"
              data-animation="fade-up"
            >
              {filteredInfluencers.map((influencer, index) => (
                <div key={influencer.id}>
                  <InfluencerCard
                    influencer={influencer}
                    priority={index < 8}
                    campaignActive={campaignActive}
                    onVoteClick={(inf) => setVoteInfluencer(inf)}
                    onVideoClick={(inf) => setVideoInfluencer(inf)}
                  />
                </div>
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
