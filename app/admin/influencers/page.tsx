import { createServiceClient } from '@/lib/supabase/server'
import InfluencerManagementClient from '@/components/admin/InfluencerManagementClient'
import type { Influencer } from '@/types'

export const dynamic = 'force-dynamic'

async function getInfluencers(): Promise<{ data: Influencer[]; error: string | null }> {
  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('influencers')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) {
      console.error('[Admin/Influencers] Fetch error:', error.message)
      return { data: [], error: error.message }
    }

    return { data: (data ?? []) as Influencer[], error: null }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
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
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          <strong>Error loading influencers:</strong> {error}
          <p className="mt-1 text-red-500">
            Ensure <code className="bg-red-100 px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code> is
            set correctly in your <code className="bg-red-100 px-1 rounded">.env.local</code> file.
          </p>
        </div>
      )}

      <InfluencerManagementClient initialInfluencers={influencers} />
    </div>
  )
}
