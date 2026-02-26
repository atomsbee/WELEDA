import { createServiceClient } from '@/lib/supabase/server'
import ReportsClient from '@/components/admin/ReportsClient'
import type { Influencer } from '@/types'

export const dynamic = 'force-dynamic'

async function getReportsData(): Promise<{ influencers: Influencer[]; totalVotes: number }> {
  const supabase = createServiceClient()

  const [{ data: influencers, error: infError }, { count: voteCount }] =
    await Promise.all([
      supabase
        .from('influencers')
        .select('*')
        .order('vote_count', { ascending: false }),
      supabase.from('votes').select('*', { count: 'exact', head: true }),
    ])

  if (infError) {
    console.error('[Reports] Error fetching influencers:', infError.message)
  }

  const list = (influencers ?? []) as Influencer[]

  // Use votes table count (authoritative); fall back to sum of vote_count column
  const sumFromInfluencers = list.reduce((sum, i) => sum + (i.vote_count || 0), 0)
  const totalVotes = Math.max(voteCount ?? 0, sumFromInfluencers)

  return { influencers: list, totalVotes }
}

export default async function ReportsPage() {
  const { influencers, totalVotes } = await getReportsData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-500 text-sm mt-1">
          Total votes: <strong>{totalVotes.toLocaleString('en-US')}</strong>
        </p>
      </div>
      <ReportsClient influencers={influencers} totalVotes={totalVotes} />
    </div>
  )
}
