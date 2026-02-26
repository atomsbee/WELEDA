'use client'

import { useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface SearchFilterBarProps {
  allHashtags: string[]
  onFilterChange: (search: string, sort: SortOption, activeHashtags: string[]) => void
}

export type SortOption = 'display_order' | 'newest' | 'alphabetical'

const VISIBLE_DEFAULT = 3

export default function SearchFilterBar({ allHashtags, onFilterChange }: SearchFilterBarProps) {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOption>('display_order')
  const [activeHashtags, setActiveHashtags] = useState<string[]>([])
  const [isSticky, setIsSticky] = useState(false)
  const [chipsExpanded, setChipsExpanded] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const notifyChange = useCallback(
    (s: string, so: SortOption, h: string[]) => {
      onFilterChange(s, so, h)
    },
    [onFilterChange]
  )

  const handleSearch = (value: string) => {
    setSearch(value)
    notifyChange(value, sort, activeHashtags)
  }

  const handleSort = (value: SortOption) => {
    setSort(value)
    notifyChange(search, value, activeHashtags)
  }

  const toggleHashtag = (tag: string) => {
    const next = activeHashtags.includes(tag)
      ? activeHashtags.filter((h) => h !== tag)
      : [...activeHashtags, tag]
    setActiveHashtags(next)
    notifyChange(search, sort, next)
  }

  const resetFilters = () => {
    setSearch('')
    setSort('display_order')
    setActiveHashtags([])
    notifyChange('', 'display_order', [])
  }

  const hasActiveFilters =
    search !== '' || sort !== 'display_order' || activeHashtags.length > 0

  // Determine which chips to show
  const activeChip = activeHashtags[0] // single active chip for "always show" logic
  const visibleChips = (() => {
    if (chipsExpanded) return allHashtags
    const defaultVisible = allHashtags.slice(0, VISIBLE_DEFAULT)
    // Always include any active chip even if outside the default range
    const extraActives = activeHashtags.filter(
      (tag) => !defaultVisible.includes(tag)
    )
    return [...defaultVisible, ...extraActives]
  })()

  const hiddenCount = allHashtags.length - VISIBLE_DEFAULT

  return (
    <div
      id="filter-bar"
      className={`sticky top-0 z-30 bg-white transition-shadow duration-300 ${
        isSticky ? 'shadow-md border-b border-weleda-card-border' : 'border-b border-weleda-card-border'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Top row: search + sort */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-weleda-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search creators..."
              className="w-full pl-9 pr-4 py-2.5 rounded-full border border-weleda-card-border text-sm focus:outline-none focus:border-weleda-green focus:ring-1 focus:ring-weleda-green transition-colors min-h-[44px]"
            />
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => handleSort(e.target.value as SortOption)}
            className="px-4 py-2.5 rounded-full border border-weleda-card-border text-sm font-medium focus:outline-none focus:border-weleda-green cursor-pointer bg-white min-h-[44px]"
          >
            <option value="display_order">Featured</option>
            <option value="newest">Newest</option>
            <option value="alphabetical">A–Z</option>
          </select>

          {/* Reset */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="px-4 py-2.5 rounded-full border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition-colors whitespace-nowrap min-h-[44px]"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Hashtag chips */}
        {allHashtags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 pb-1 items-center">
            {visibleChips.map((tag) => {
              const isActive = activeHashtags.includes(tag)
              return (
                <button
                  key={tag}
                  onClick={() => toggleHashtag(tag)}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 min-h-[32px]',
                    isActive
                      ? 'bg-weleda-green text-white shadow-sm'
                      : 'bg-weleda-bg border border-weleda-card-border text-weleda-muted hover:border-weleda-green hover:text-weleda-green'
                  )}
                >
                  #{tag}
                </button>
              )
            })}

            {/* Expand button */}
            {!chipsExpanded && hiddenCount > 0 && (
              <button
                onClick={() => setChipsExpanded(true)}
                className="px-3 py-1 rounded-full text-xs font-medium border border-dashed border-gray-300 text-gray-500 hover:border-weleda-green hover:text-weleda-green transition-colors min-h-[32px]"
              >
                + {hiddenCount} more
              </button>
            )}

            {/* Collapse button */}
            {chipsExpanded && (
              <button
                onClick={() => setChipsExpanded(false)}
                className="px-3 py-1 text-xs text-gray-500 hover:text-gray-900 transition-colors min-h-[32px]"
              >
                Show less
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
