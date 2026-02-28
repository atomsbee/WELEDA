'use client'

import { useState, useMemo, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import HeroSection from '@/components/HeroSection'
import InfluencerCard from '@/components/InfluencerCard'
import VideoModal from '@/components/VideoModal'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import dynamic from 'next/dynamic'

const VoteModal = dynamic(() => import('@/components/VoteModal'), { ssr: false })
import type { Influencer } from '@/types'
import { CATEGORIES, CATEGORY_KEYS, type CategoryKey } from '@/lib/config/categories'

type SortOption = 'display_order' | 'votes' | 'newest' | 'alphabetical'

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

  const gridRef = useRef<HTMLDivElement>(null)

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
      case 'votes':
        result.sort((a, b) => b.vote_count - a.vote_count)
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

        {/* ── COMPACT STICKY FILTER BAR ──────────────────────────────── */}
        <div
          className="sticky top-[60px] md:top-[72px] z-30 border-b"
          style={{
            background: 'var(--bg-filter)',
            backdropFilter: 'blur(16px)',
            borderColor: 'var(--border-nav)',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 py-2.5">
            <div className="flex items-center gap-2">

              {/* Category pills — scrollable horizontal strip */}
              <div className="flex-1 overflow-x-auto scrollbar-hide">
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
                        {cat.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Search */}
              <div className="relative flex-shrink-0 w-36 md:w-52">
                <svg
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
                  style={{ color: 'var(--text-muted)' }}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Suchen..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl text-sm outline-none"
                  style={{
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-input)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              {/* Divider */}
              <div className="w-px h-5 flex-shrink-0" style={{ background: 'var(--border-nav)' }} />

              {/* Sort */}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="flex-shrink-0 px-2 py-1.5 rounded-xl text-xs font-medium outline-none cursor-pointer"
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-input)',
                  color: 'var(--text-primary)',
                }}
              >
                <option value="display_order">Featured</option>
                <option value="votes">Meiste Votes</option>
                <option value="newest">Neueste</option>
                <option value="alphabetical">A–Z</option>
              </select>
            </div>

            {/* Results count */}
            {/* <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>
                {filteredInfluencers.length}
              </span>{' '}Creator
              {!campaignActive && <span className="ml-1.5">· Voting Ended</span>}
            </p> */}
          </div>
        </div>

        {/* ── HASHTAG PILLS STRIP ───────────────────────────────────── */}
        {allHashtags.length > 0 && (
          <div
            className="border-b px-4 py-2"
            style={{
              background: 'var(--bg-filter)',
              backdropFilter: 'blur(12px)',
              borderColor: 'var(--border-nav)',
            }}
          >
            <div className="max-w-6xl mx-auto flex items-center gap-1.5 flex-wrap">
              {activeHashtags.length > 0 && (
                <button
                  onClick={() => setActiveHashtags([])}
                  className="text-xs px-2.5 py-1 rounded-full font-semibold transition-all duration-200 flex-shrink-0"
                  style={{
                    background: 'rgba(239,68,68,0.12)',
                    border: '1px solid rgba(239,68,68,0.30)',
                    color: '#ef4444',
                  }}
                >
                  ✕ Reset
                </button>
              )}
              {allHashtags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    const next = activeHashtags.includes(tag)
                      ? activeHashtags.filter((h) => h !== tag)
                      : [...activeHashtags, tag]
                    setActiveHashtags(next)
                  }}
                  className="text-xs px-2.5 py-1 rounded-full font-medium transition-all duration-200"
                  style={{
                    background: activeHashtags.includes(tag)
                      ? 'rgba(139,92,246,0.15)'
                      : 'var(--bg-chip)',
                    border: activeHashtags.includes(tag)
                      ? '1px solid rgba(139,92,246,0.40)'
                      : '1px solid var(--border-chip)',
                    color: activeHashtags.includes(tag)
                      ? 'var(--label-violet)'
                      : 'var(--text-chip)',
                  }}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}

        <section className="max-w-7xl mx-auto px-4 pt-10 pb-24 md:pb-32">
          {/* Grid anchor */}
          <div ref={gridRef} />

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
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{
                    duration: 0.5,
                    delay: Math.min(index * 0.07, 0.5),
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
