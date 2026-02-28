'use client'

import { useState } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import type { Influencer } from '@/types'
import InfluencerForm from './InfluencerForm'
import { Switch } from '@/components/ui/switch'
import { getCategoryConfig } from '@/lib/config/categories'

interface Props {
  initialInfluencers: Influencer[]
}

export default function InfluencerManagementClient({ initialInfluencers }: Props) {
  const [influencers, setInfluencers] = useState<Influencer[]>(initialInfluencers)
  const [showForm, setShowForm] = useState(false)
  const [editInfluencer, setEditInfluencer] = useState<Influencer | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const handleAdd = () => {
    setEditInfluencer(null)
    setShowForm(true)
  }

  const handleEdit = (inf: Influencer) => {
    setEditInfluencer(inf)
    setShowForm(true)
  }

  const handleSave = (saved: Influencer) => {
    setInfluencers((prev) => {
      const idx = prev.findIndex((i) => i.id === saved.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = saved
        return next
      }
      return [saved, ...prev]
    })
    setShowForm(false)
    setEditInfluencer(null)
  }

  const handleToggleActive = async (inf: Influencer, checked: boolean) => {
    // Optimistic update
    setInfluencers((prev) =>
      prev.map((i) => (i.id === inf.id ? { ...i, is_active: checked } : i))
    )
    setTogglingId(inf.id)

    try {
      const res = await fetch(`/api/admin/influencers/${inf.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: checked }),
      })

      const json = (await res.json()) as { success: boolean; error?: string }

      if (json.success) {
        toast.success(`${inf.name} is now ${checked ? 'active' : 'inactive'}`)
      } else {
        // Revert on failure
        setInfluencers((prev) =>
          prev.map((i) => (i.id === inf.id ? { ...i, is_active: !checked } : i))
        )
        toast.error(`Failed to update status: ${json.error ?? 'Unknown error'}`)
      }
    } catch {
      // Revert on error
      setInfluencers((prev) =>
        prev.map((i) => (i.id === inf.id ? { ...i, is_active: !checked } : i))
      )
      toast.error('Failed to update status. Please try again.')
    } finally {
      setTogglingId(null)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/influencers/${deleteId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setInfluencers((prev) => prev.filter((i) => i.id !== deleteId))
        toast.success('Creator deleted successfully')
      } else {
        toast.error('Failed to delete creator')
      }
    } catch {
      toast.error('Failed to delete creator')
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  return (
    <>
      {/* Add button */}
      <div className="flex justify-end">
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90 min-h-[44px]"
          style={{ background: '#0b4535' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Add New Influencer</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 w-12">
                  Photo
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">
                  Handle
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">
                  Category
                </th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">
                  Votes
                </th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">
                  Status
                </th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {influencers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    No influencers found. Check your Supabase service role key.
                  </td>
                </tr>
              ) : (
                influencers.map((inf) => {
                  const cat = getCategoryConfig(inf.category)
                  return (
                  <tr key={inf.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="relative w-9 h-9 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        <Image
                          src={inf.photo_url}
                          alt={inf.name}
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{inf.name}</td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                      {inf.handle}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {cat ? (
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={{ background: cat.badgeBg, color: cat.badgeText }}
                        >
                          {cat.label}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-bold" style={{ color: '#0b4535' }}>
                      {inf.vote_count.toLocaleString('en-US')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Switch
                          checked={inf.is_active}
                          onCheckedChange={(checked) => handleToggleActive(inf, checked)}
                          disabled={togglingId === inf.id}
                          aria-label={`Toggle ${inf.name} status`}
                        />
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full hidden md:inline-block ${
                            inf.is_active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {inf.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(inf)}
                          className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:border-weleda-green hover:text-weleda-green text-xs font-medium transition-colors min-h-[32px]"
                        >
                          <span className="hidden sm:inline">Edit</span>
                          <svg
                            className="w-3.5 h-3.5 sm:hidden"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteId(inf.id)}
                          className="px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 text-xs font-medium transition-colors min-h-[32px]"
                        >
                          <span className="hidden sm:inline">Delete</span>
                          <svg
                            className="w-3.5 h-3.5 sm:hidden"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )})
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Influencer Form Modal */}
      {showForm && (
        <InfluencerForm
          influencer={editInfluencer}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setEditInfluencer(null)
          }}
        />
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-bold text-gray-900 text-lg mb-2">Delete creator?</h3>
            <p className="text-gray-500 text-sm mb-6">
              This action cannot be undone. All votes for this creator will also be
              deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 min-h-[44px]"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 disabled:opacity-60 min-h-[44px]"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
