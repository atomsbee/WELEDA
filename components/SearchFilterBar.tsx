'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

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

  const handleSort = (value: string) => {
    const so = value as SortOption
    setSort(so)
    notifyChange(search, so, activeHashtags)
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

  // Base chips (always shown) + any active chips that fall outside the base range
  const baseChips = allHashtags.slice(0, VISIBLE_DEFAULT)
  const extraActiveChips = activeHashtags.filter((tag) => !baseChips.includes(tag))
  const hiddenChips = allHashtags.slice(VISIBLE_DEFAULT)
  const hiddenCount = hiddenChips.length

  return (
    <motion.div
      id="filter-bar"
      className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-weleda-card-border"
      initial={false}
      animate={{
        boxShadow: isSticky
          ? '0 4px 20px rgba(0,0,0,0.08)'
          : '0 0 0px rgba(0,0,0,0)',
      }}
      transition={{ duration: 0.3 }}
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

          {/* Sort — shadcn-style Select */}
          <Select value={sort} onValueChange={handleSort}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="display_order">Featured</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="alphabetical">A–Z</SelectItem>
            </SelectContent>
          </Select>

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
            {/* Base chips — always visible */}
            {baseChips.map((tag) => {
              const isActive = activeHashtags.includes(tag)
              return (
                <motion.button
                  layout
                  key={tag}
                  onClick={() => toggleHashtag(tag)}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 min-h-[32px]',
                    isActive
                      ? 'bg-weleda-green text-white shadow-sm'
                      : 'bg-weleda-bg border border-weleda-card-border text-weleda-muted hover:border-weleda-green hover:text-weleda-green'
                  )}
                >
                  #{tag}
                </motion.button>
              )
            })}

            {/* Extra active chips outside base range — always visible */}
            {extraActiveChips.map((tag) => (
              <motion.button
                layout
                key={`active-${tag}`}
                onClick={() => toggleHashtag(tag)}
                className="px-3 py-1 rounded-full text-xs font-medium min-h-[32px] bg-weleda-green text-white shadow-sm transition-colors duration-200"
              >
                #{tag}
              </motion.button>
            ))}

            {/* Expanded hidden chips — animated */}
            <AnimatePresence>
              {chipsExpanded &&
                hiddenChips
                  .filter((tag) => !activeHashtags.includes(tag))
                  .map((tag, i) => {
                    const isActive = activeHashtags.includes(tag)
                    return (
                      <motion.button
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ delay: i * 0.03, duration: 0.15 }}
                        onClick={() => toggleHashtag(tag)}
                        className={cn(
                          'px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 min-h-[32px]',
                          isActive
                            ? 'bg-weleda-green text-white shadow-sm'
                            : 'bg-weleda-bg border border-weleda-card-border text-weleda-muted hover:border-weleda-green hover:text-weleda-green'
                        )}
                      >
                        #{tag}
                      </motion.button>
                    )
                  })}
            </AnimatePresence>

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
    </motion.div>
  )
}
