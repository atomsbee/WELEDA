import InfluencerManagementClient from '@/components/admin/InfluencerManagementClient'
import type { Influencer } from '@/types'

export const dynamic = 'force-dynamic'

async function getInfluencers(): Promise<{ data: Influencer[]; error: string | null }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    return { data: [], error: 'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars' }
  }

  try {
    const res = await fetch(
      `${url}/rest/v1/influencers?order=display_order.asc`,
      {
        cache: 'no-store',
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!res.ok) {
      const text = await res.text()
      console.error('[Admin/Influencers] HTTP error:', res.status, text)
      return { data: [], error: `HTTP ${res.status}: ${text}` }
    }

    const data = await res.json() as Influencer[]
    return { data, error: null }
  } catch (err) {
    const cause = (err as NodeJS.ErrnoException)?.cause
    const causeMsg = cause instanceof Error ? ` (cause: ${cause.message})` : ''
    const msg = err instanceof Error ? `${err.message}${causeMsg}` : 'Unknown error'
    console.error('[Admin/Influencers] Exception:', msg)
    return { data: [], error: msg }
  }
}

export default async function InfluencersPage() {
  const { data: influencers, error } = await getInfluencers()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Influencers</h1>
          <p className="text-gray-500 text-sm mt-1">{influencers.length} creators total</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 space-y-2">
          <p><strong>Error loading influencers:</strong></p>
          <code className="block bg-red-100 px-2 py-1 rounded text-xs break-all">{error}</code>
          <p className="text-red-500 text-xs">
            Check the terminal running <code className="bg-red-100 px-1 rounded">npm run dev</code> for the full stack trace.
          </p>
        </div>
      )}

      <InfluencerManagementClient initialInfluencers={influencers} />
    </div>
  )
}
