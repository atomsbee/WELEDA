'use client'

import { useState } from 'react'
import type { CampaignPhase } from '@/lib/campaign'

const PHASES: { value: CampaignPhase; label: string; dot: string; desc: string }[] = [
  { value: 'pre', label: 'Bewerbung', dot: 'bg-yellow-500', desc: 'CTA: "Jetzt bewerben" — Voting not started yet' },
  { value: 'voting', label: 'Voting Live', dot: 'bg-green-500', desc: 'CTA: "Jetzt abstimmen" — Users can vote' },
  { value: 'ended', label: 'Beendet', dot: 'bg-gray-400', desc: 'CTA: "Voting beendet" — Voting closed' },
]

export default function CampaignToggle({ initialPhase }: { initialPhase: CampaignPhase }) {
  const [phase, setPhase] = useState<CampaignPhase>(initialPhase)
  const [loading, setLoading] = useState(false)

  const current = PHASES.find((p) => p.value === phase)!

  async function changePhase(newPhase: CampaignPhase) {
    if (newPhase === phase) return
    setLoading(true)
    try {
      const res = await fetch('/api/admin/campaign', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phase: newPhase }),
      })

      const data = await res.json()
      if (data.success) {
        setPhase(data.phase)
      }
    } catch {
      // keep current on error
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-gray-500">Campaign Phase</p>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${current.dot}`} />
          <span className="text-xs font-bold text-gray-700">{current.label}</span>
        </div>
      </div>

      <div className="flex gap-1.5">
        {PHASES.map((p) => (
          <button
            key={p.value}
            onClick={() => changePhase(p.value)}
            disabled={loading}
            className="flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-150 disabled:opacity-50"
            style={{
              background: phase === p.value ? '#0b4535' : '#f3f4f6',
              color: phase === p.value ? '#ffffff' : '#6b7280',
              border: phase === p.value ? '1px solid #0b4535' : '1px solid #e5e7eb',
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-2.5">{current.desc}</p>
    </div>
  )
}
