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

  const downloadSummaryCsv = () => {
    const today = new Date().toISOString().slice(0, 10)
    const header = 'rank,name,handle,vote_count\n'
    const rows = influencers
      .map((inf, i) => `${i + 1},"${inf.name}","${inf.handle}",${inf.vote_count}`)
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
          <div className="flex justify-end">
            <button
              onClick={downloadSummaryCsv}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              Download CSV
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 w-12">Rank</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Handle</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Votes</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">% Total</th>
                  <th className="px-4 py-3 w-36"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {influencers.map((inf, i) => {
                  const pct = totalVotes > 0 ? ((inf.vote_count / totalVotes) * 100).toFixed(1) : '0.0'
                  return (
                    <tr key={inf.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                          style={{ background: i < 3 ? '#D4A853' : '#6B7280' }}
                        >
                          {i + 1}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{inf.name}</td>
                      <td className="px-4 py-3 text-gray-500">{inf.handle}</td>
                      <td className="px-4 py-3 text-right font-bold" style={{ color: '#0b4535' }}>
                        {inf.vote_count.toLocaleString('en-US')}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-500">{pct}%</td>
                      <td className="px-4 py-3">
                        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${(inf.vote_count / maxVotes) * 100}%`,
                              background: i === 0 ? '#D4A853' : '#52B788',
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  )
                })}
                <tr className="bg-gray-50 font-bold">
                  <td className="px-4 py-3 text-gray-500" colSpan={3}>
                    Total
                  </td>
                  <td className="px-4 py-3 text-right" style={{ color: '#0b4535' }}>
                    {totalVotes.toLocaleString('en-US')}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-500">100%</td>
                  <td />
                </tr>
              </tbody>
            </table>
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
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {votes.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                          No votes found.
                        </td>
                      </tr>
                    ) : (
                      votes.map((vote) => {
                        const d = new Date(vote.voted_at)
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
