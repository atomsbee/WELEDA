import { createServiceClient } from '@/lib/supabase/server'
import { isCampaignActive, formatCampaignEndDate } from '@/lib/campaign'
import type { Influencer } from '@/types'

export const dynamic = 'force-dynamic'

interface VoteRow {
  voter_name: string
  voted_at: string
  influencers: { name: string } | null
}

async function getDashboardData() {
  const supabase = createServiceClient()

  const [
    { data: influencers, error: infError },
    { count: totalVotes },
    { data: recentVotes },
  ] = await Promise.all([
    supabase
      .from('influencers')
      .select('id, name, handle, vote_count, is_active, photo_url')
      .order('vote_count', { ascending: false }),
    supabase.from('votes').select('*', { count: 'exact', head: true }),
    supabase
      .from('votes')
      .select('voter_name, voted_at, influencers(name)')
      .order('voted_at', { ascending: false })
      .limit(20),
  ])

  if (infError) {
    console.error('[Dashboard] Error fetching influencers:', infError.message)
  }

  return {
    influencers: (influencers ?? []) as Influencer[],
    totalVotes: totalVotes ?? 0,
    recentVotes: (recentVotes ?? []) as unknown as VoteRow[],
  }
}

export default async function AdminDashboard() {
  const { influencers, totalVotes, recentVotes } = await getDashboardData()
  const campaignActive = isCampaignActive()
  const endDate = formatCampaignEndDate()
  const activeCount = influencers.filter((i) => i.is_active).length
  const top5 = influencers.slice(0, 5)
  const maxVotes = top5[0]?.vote_count ?? 1

  // Also compute from influencers as a cross-check
  const totalFromInfluencers = influencers.reduce(
    (sum, i) => sum + (i.vote_count || 0),
    0
  )
  // Use whichever is higher (votes table is authoritative if service key is set)
  const displayTotalVotes = Math.max(totalVotes, totalFromInfluencers)

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Community Voting overview</p>
      </div>

      {/* Stats grid: 1 col mobile, 2 col tablet, 4 col desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Votes"
          value={displayTotalVotes.toLocaleString('en-US')}
          icon="❤️"
        />
        <StatCard
          title="Active Creators"
          value={activeCount.toString()}
          icon="👤"
        />
        <StatCard
          title="Total Creators"
          value={influencers.length.toString()}
          icon="🌿"
        />
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-500">Campaign Status</p>
            <span className="text-xl">📅</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                campaignActive ? 'bg-green-500' : 'bg-gray-400'
              }`}
            />
            <p className="text-xl font-bold text-gray-900">
              {campaignActive ? 'Active' : 'Ended'}
            </p>
          </div>
          {endDate && (
            <p className="text-sm text-gray-400 mt-1">
              {campaignActive ? `Ends on ${endDate}` : `Ended on ${endDate}`}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 creators */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h2 className="font-bold text-gray-900 mb-4">Top 5 Creators</h2>
          {top5.length === 0 ? (
            <p className="text-gray-400 text-sm">No data yet.</p>
          ) : (
            <div className="space-y-3">
              {top5.map((inf, i) => (
                <div key={inf.id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: '#0b4535', color: 'white' }}
                      >
                        {i + 1}
                      </span>
                      <span className="font-medium text-gray-900 truncate">
                        {inf.name}
                      </span>
                    </div>
                    <span className="font-bold flex-shrink-0 ml-2" style={{ color: '#0b4535' }}>
                      {inf.vote_count.toLocaleString('en-US')}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${maxVotes > 0 ? (inf.vote_count / maxVotes) * 100 : 0}%`,
                        background: i === 0 ? '#D4A853' : '#52B788',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent votes */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h2 className="font-bold text-gray-900 mb-4">Recent Votes</h2>
          <div className="overflow-x-auto">
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {recentVotes.length === 0 ? (
                <p className="text-gray-400 text-sm">No votes yet.</p>
              ) : (
                recentVotes.map((vote, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0 min-w-0"
                  >
                    <div className="min-w-0 mr-2">
                      <p className="font-medium text-gray-900 truncate">
                        {vote.voter_name}
                      </p>
                      <p className="text-gray-400 text-xs truncate">
                        voted for{' '}
                        <span className="font-medium" style={{ color: '#0b4535' }}>
                          {vote.influencers?.name ?? '–'}
                        </span>
                      </p>
                    </div>
                    <p className="text-gray-400 text-xs whitespace-nowrap flex-shrink-0">
                      {new Date(vote.voted_at).toLocaleString('en-US', {
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string
  value: string
  icon: string
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <span className="text-xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}
