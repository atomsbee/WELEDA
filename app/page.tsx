import VotingPageClient from '@/components/VotingPageClient'
import { isCampaignActive, formatCampaignEndDate } from '@/lib/campaign'
import type { Influencer } from '@/types'

async function getInfluencers(): Promise<Influencer[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) return []

  try {
    // Server-side fetch using anon key (RLS disabled — influencers table is public)
    const res = await fetch(
      `${supabaseUrl}/rest/v1/influencers?is_active=eq.true&order=display_order.asc`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
      }
    )

    if (!res.ok) return []
    return res.json() as Promise<Influencer[]>
  } catch {
    return []
  }
}

export default async function HomePage() {
  const [influencers, campaignActive, endDate] = await Promise.all([
    getInfluencers(),
    Promise.resolve(isCampaignActive()),
    Promise.resolve(formatCampaignEndDate()),
  ])

  return (
    <VotingPageClient
      initialInfluencers={influencers}
      campaignActive={campaignActive}
      endDate={endDate}
    />
  )
}
