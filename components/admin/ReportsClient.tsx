'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Influencer, AdminVote } from '@/types'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { CATEGORIES, CATEGORY_KEYS, getCategoryConfig } from '@/lib/config/categories'

interface Props {
  influencers: Influencer[]
  totalVotes: number
}

type Tab = 'summary' | 'individual'

interface VotesResponse {
  success: boolean
  data?: {
    votes: AdminVote[]
    total: number
    page: number
    limit: number
  }
}

export default function ReportsClient({ influencers, totalVotes }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('summary')
  const [selectedInfluencerId, setSelectedInfluencerId] = useState<string>('all')
  const [votes, setVotes] = useState<AdminVote[]>([])
  const [totalVoteCount, setTotalVoteCount] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const limit = 50

  const fetchVotes = useCallback(async (infId: string, p: number) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(limit) })
      if (infId !== 'all') params.set('influencerId', infId)

      const res = await fetch(`/api/admin/votes?${params}`)
      const json = (await res.json()) as VotesResponse
      if (json.success && json.data) {
        setVotes(json.data.votes)
        setTotalVoteCount(json.data.total)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (activeTab === 'individual') {
      fetchVotes(selectedInfluencerId, page)
    }
  }, [activeTab, selectedInfluencerId, page, fetchVotes])

  const downloadCsv = (influencerId?: string) => {
    const params = new URLSearchParams()
    if (influencerId && influencerId !== 'all') {
      params.set('influencerId', influencerId)
    }
    window.open(`/api/admin/votes/export?${params}`, '_blank')
  }

  const downloadPDF = () => {
    const today = new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })

    const tableRows = groupedSummary.flatMap((group) =>
      group.items.map((inf, i) => {
        const pct = group.categoryTotal > 0 ? ((inf.vote_count / group.categoryTotal) * 100).toFixed(1) : '0.0'
        return `<tr>
          <td>${i + 1}</td>
          <td style="font-weight:500">${inf.name}</td>
          <td style="color:#6b7280">${inf.handle}</td>
          <td><span style="display:inline-block;padding:2px 8px;border-radius:9999px;font-size:11px;font-weight:700;background:${group.config.gradient};color:white">${group.config.label}</span></td>
          <td style="text-align:right;font-weight:700;color:${group.config.primary}">${inf.vote_count.toLocaleString('de-DE')}</td>
          <td style="text-align:right;color:#6b7280">${pct}%</td>
        </tr>`
      })
    ).join('')

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>WELEDA Community Vote — Ergebnisbericht</title>
  <style>
    body { font-family: Arial, sans-serif; color: #111827; padding: 40px; font-size: 13px; }
    h1 { color: #0b4535; font-size: 20px; margin: 0 0 4px; }
    .meta { color: #6b7280; font-size: 12px; margin-bottom: 28px; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #0b4535; color: white; padding: 9px 12px; text-align: left; font-size: 12px; }
    td { padding: 8px 12px; border-bottom: 1px solid #e5e7eb; }
    .total-row td { font-weight: 700; background: #f3f4f6; border-top: 2px solid #d1d5db; }
    @media print { body { padding: 16px; } }
  </style>
</head>
<body>
  <h1>WELEDA Community Vote — Ergebnisbericht</h1>
  <p class="meta">Stand: ${today} &nbsp;·&nbsp; Gesamt: ${totalVotes.toLocaleString('de-DE')} Votes</p>
  <table>
    <thead>
      <tr>
        <th>#</th><th>Name</th><th>Handle</th><th>Kategorie</th>
        <th style="text-align:right">Votes</th><th style="text-align:right">% Kat.</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows}
      <tr class="total-row">
        <td colspan="4">Gesamt</td>
        <td style="text-align:right">${totalVotes.toLocaleString('de-DE')}</td>
        <td></td>
      </tr>
    </tbody>
  </table>
</body>
</html>`

    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(html)
    win.document.close()
    setTimeout(() => { win.print(); win.close() }, 500)
  }

  const downloadSummaryCsv = () => {
    const today = new Date().toISOString().slice(0, 10)
    const header = 'rank,name,handle,category,vote_count\n'
    const rows = influencers
      .map((inf, i) => `${i + 1},"${inf.name}","${inf.handle}","${inf.category ?? ''}",${inf.vote_count}`)
      .join('\n')
    const csv = header + rows
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `weleda-voting-summary-${today}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const maxVotes = influencers[0]?.vote_count ?? 1

  // Group influencers by category for summary view
  const groupedSummary = CATEGORY_KEYS.map((key) => ({
    key,
    config: CATEGORIES[key],
    items: influencers.filter((inf) => inf.category === key),
    categoryTotal: influencers
      .filter((inf) => inf.category === key)
      .reduce((s, inf) => s + inf.vote_count, 0),
  }))

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-full sm:w-fit">
        {[
          { id: 'summary' as Tab, label: 'Summary' },
          { id: 'individual' as Tab, label: 'Individual Votes' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              activeTab === tab.id
                ? 'bg-white shadow text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Summary */}
      {activeTab === 'summary' && (
        <div className="space-y-4">
          <div className="flex items-center justify-end gap-2 flex-wrap">
            <button
              onClick={downloadSummaryCsv}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              CSV exportieren
            </button>
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              PDF herunterladen
            </button>
          </div>

          <div className="space-y-6">
            {groupedSummary.map((group) => (
              <div key={group.key} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Category header */}
                <div
                  className="px-4 py-3 flex items-center justify-between"
                  style={{ background: group.config.gradientSubtle, borderBottom: `2px solid ${group.config.border}` }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: group.config.badgeBg, color: group.config.badgeText }}
                    >
                      {group.config.label}
                    </span>
                    <span className="text-xs text-gray-500">{group.config.hashtag}</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: group.config.primary }}>
                    {group.categoryTotal.toLocaleString('en-US')} votes
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-4 py-2.5 font-semibold text-gray-600 w-12">Rank</th>
                        <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Name</th>
                        <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Handle</th>
                        <th className="text-right px-4 py-2.5 font-semibold text-gray-600">Votes</th>
                        <th className="text-right px-4 py-2.5 font-semibold text-gray-600">% Cat.</th>
                        <th className="px-4 py-2.5 w-36"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {group.items.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-6 text-center text-gray-400 text-xs">
                            No creators in this category.
                          </td>
                        </tr>
                      ) : (
                        group.items.map((inf, i) => {
                          const pct = group.categoryTotal > 0 ? ((inf.vote_count / group.categoryTotal) * 100).toFixed(1) : '0.0'
                          const localMax = group.items[0]?.vote_count ?? 1
                          return (
                            <tr key={inf.id} className="hover:bg-gray-50">
                              <td className="px-4 py-2.5">
                                <span
                                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                  style={{ background: i < 3 ? group.config.primary : '#9CA3AF' }}
                                >
                                  {i + 1}
                                </span>
                              </td>
                              <td className="px-4 py-2.5 font-medium text-gray-900">{inf.name}</td>
                              <td className="px-4 py-2.5 text-gray-500">{inf.handle}</td>
                              <td className="px-4 py-2.5 text-right font-bold" style={{ color: group.config.primary }}>
                                {inf.vote_count.toLocaleString('en-US')}
                              </td>
                              <td className="px-4 py-2.5 text-right text-gray-500">{pct}%</td>
                              <td className="px-4 py-2.5">
                                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                  <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                      width: `${(inf.vote_count / localMax) * 100}%`,
                                      background: group.config.gradient,
                                    }}
                                  />
                                </div>
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
            {/* Grand total */}
            <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-between text-sm font-semibold text-gray-700 border border-gray-200">
              <span>Grand Total</span>
              <span style={{ color: '#0b4535' }}>{totalVotes.toLocaleString('en-US')} votes</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Individual Votes */}
      {activeTab === 'individual' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <Select
              value={selectedInfluencerId}
              onValueChange={(v) => {
                setSelectedInfluencerId(v)
                setPage(1)
              }}
            >
              <SelectTrigger className="w-full sm:w-[220px] rounded-xl">
                <SelectValue placeholder="All Creators" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Creators</SelectItem>
                {influencers.map((inf) => (
                  <SelectItem key={inf.id} value={inf.id} textValue={inf.name}>
                    {inf.name} {inf.handle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex flex-wrap gap-2">
              {selectedInfluencerId !== 'all' && (
                <button
                  onClick={() => downloadCsv(selectedInfluencerId)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm hover:bg-gray-50 transition-colors"
                >
                  Selected CSV
                </button>
              )}
              <button
                onClick={() => downloadCsv()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm hover:bg-gray-50 transition-colors"
              >
                All Votes CSV
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <svg className="animate-spin w-6 h-6 text-weleda-green" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">
                        <span title="Anonymised identifier for GDPR compliance — first 8 chars of email hash">
                          Voter ID
                        </span>
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Creator</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Category</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {votes.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                          No votes found.
                        </td>
                      </tr>
                    ) : (
                      votes.map((vote) => {
                        const d = new Date(vote.voted_at)
                        const catConfig = getCategoryConfig(vote.category)
                        return (
                          <tr key={vote.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">{vote.voter_name}</td>
                            <td className="px-4 py-3 text-gray-500 font-mono text-xs">{vote.email_masked}</td>
                            <td className="px-4 py-3">
                              <span className="font-medium" style={{ color: '#0b4535' }}>
                                {vote.influencer_name}
                              </span>{' '}
                              <span className="text-gray-400">{vote.influencer_handle}</span>
                            </td>
                            <td className="px-4 py-3">
                              {catConfig ? (
                                <span
                                  className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap"
                                  style={{ background: catConfig.badgeBg, color: catConfig.badgeText }}
                                >
                                  {catConfig.label}
                                </span>
                              ) : (
                                <span className="text-gray-400 text-xs">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-gray-500">
                              {d.toLocaleDateString('en-US')}
                            </td>
                            <td className="px-4 py-3 text-gray-500">
                              {d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalVoteCount > limit && (
            <div className="flex items-center justify-between text-sm">
              <p className="text-gray-500">
                {((page - 1) * limit) + 1}–{Math.min(page * limit, totalVoteCount)} of{' '}
                {totalVoteCount.toLocaleString('en-US')} votes
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-xl border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page * limit >= totalVoteCount}
                  className="px-4 py-2 rounded-xl border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
