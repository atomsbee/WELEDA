'use client'

import { useState, useCallback } from 'react'
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
  const [chipsExpanded, setChipsExpanded] = useState(false)

  const notifyChange = useCallback(
    (s: string, so: SortOption, h: string[]) => onFilterChange(s, so, h),
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

  const hasActiveFilters = search !== '' || sort !== 'display_order' || activeHashtags.length > 0

  const baseChips = allHashtags.slice(0, VISIBLE_DEFAULT)
  const extraActiveChips = activeHashtags.filter((tag) => !baseChips.includes(tag))
  const hiddenChips = allHashtags.slice(VISIBLE_DEFAULT)
  const hiddenCount = hiddenChips.length

  return (
    <motion.div
      id="filter-bar"
      className="sticky top-0 z-30"
      initial={false}
      transition={{ duration: 0.3 }}
      style={{
        background: 'var(--bg-filter)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-nav)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Top row: search + sort */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: 'var(--text-faint)' }}
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
              className="w-full pl-9 pr-4 py-2.5 rounded-full text-sm focus:outline-none transition-all min-h-[44px]"
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-input)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                color: 'var(--text-primary)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(11,69,53,0.5)'
                e.currentTarget.style.boxShadow = '0 0 0 2px rgba(11,69,53,0.15)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-input)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
          </div>

          {/* Sort */}
          <Select value={sort} onValueChange={handleSort}>
            <SelectTrigger
              className="w-[160px] border-none focus:ring-0 focus:ring-offset-0"
              style={{
                background: 'var(--bg-chip)',
                border: '1px solid var(--border-chip)',
                color: 'var(--text-primary)',
              }}
            >
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
              className="px-4 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap min-h-[44px]"
              style={{
                background: 'rgba(239,68,68,0.12)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: 'rgba(252,165,165,0.9)',
              }}
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Hashtag chips */}
        {allHashtags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 pb-1 items-center">
            {/* Base chips */}
            {baseChips.map((tag) => {
              const isActive = activeHashtags.includes(tag)
              return (
                <motion.button
                  layout
                  key={tag}
                  onClick={() => toggleHashtag(tag)}
                  className={cn('px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 min-h-[32px]')}
                  style={
                    isActive
                      ? {
                        background: 'linear-gradient(135deg, #0b4535, #1a7a52)',
                        border: '1px solid transparent',
                        color: '#fff',
                      }
                      : {
                        background: 'var(--bg-chip)',
                        border: '1px solid var(--border-chip)',
                        color: 'var(--text-chip)',
                      }
                  }
                >
                  #{tag}
                </motion.button>
              )
            })}

            {/* Extra active chips outside base range */}
            {extraActiveChips.map((tag) => (
              <motion.button
                layout
                key={`active-${tag}`}
                onClick={() => toggleHashtag(tag)}
                className="px-3 py-1 rounded-full text-xs font-medium min-h-[32px] text-white"
                style={{
                  background: 'linear-gradient(135deg, #7C3AED, #B478FF)',
                  border: '1px solid transparent',
                }}
              >
                #{tag}
              </motion.button>
            ))}

            {/* Expanded hidden chips */}
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
                        className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 min-h-[32px]"
                        style={
                          isActive
                            ? {
                              background: 'linear-gradient(135deg, #0b4535, #1a7a52)',
                              border: '1px solid transparent',
                              color: '#fff',
                            }
                            : {
                              background: 'var(--bg-chip)',
                              border: '1px solid var(--border-chip)',
                              color: 'var(--text-chip)',
                            }
                        }
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
                className="px-3 py-1 rounded-full text-xs font-medium transition-all min-h-[32px]"
                style={{
                  background: 'transparent',
                  border: '1px dashed var(--border-chip)',
                  color: 'var(--text-faint)',
                }}
              >
                + {hiddenCount} more
              </button>
            )}

            {/* Collapse button */}
            {chipsExpanded && (
              <button
                onClick={() => setChipsExpanded(false)}
                className="px-3 py-1 text-xs transition-colors min-h-[32px]"
                style={{ color: 'var(--text-faint)' }}
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
