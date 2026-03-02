import HeroSection from '@/components/HeroSection'
import MarqueeSection from '@/components/MarqueeSection'
import HowToSection from '@/components/HowToSection'
import CategorySection from '@/components/CategorySection'
import CastingTimeline from '@/components/CastingTimeline'
import WasduWissenmussSection from '@/components/WasduWissenmussSection'
import VotingSection from '@/components/VotingSection'
import AtmosphericBanner from '@/components/AtmosphericBanner'
import { getCampaignPhase } from '@/lib/campaign'
import type { Influencer } from '@/types'

async function getInfluencers(): Promise<Influencer[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) return []

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/influencers?is_active=eq.true&order=display_order.asc`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        next: { revalidate: 60 },
      }
    )

    if (!res.ok) return []
    return res.json() as Promise<Influencer[]>
  } catch {
    return []
  }
}

export default async function HomePage() {
  const [influencers, campaignPhase] = await Promise.all([
    getInfluencers(),
    getCampaignPhase(),
  ])

  return (
    <main>
      <HeroSection campaignPhase={campaignPhase} />
      <MarqueeSection />
      <HowToSection />
      <CategorySection />
      <CastingTimeline />
      <WasduWissenmussSection />
      <VotingSection initialInfluencers={influencers} campaignPhase={campaignPhase} />
      <AtmosphericBanner />
    </main>
  )
}
