import Image from 'next/image'
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
    <>
      <VotingPageClient
        initialInfluencers={influencers}
        campaignActive={campaignActive}
        endDate={endDate}
      />

      {/* ── TENERIFE ATMOSPHERIC IMAGE ────────────────────── */}

      <section className="max-w-7xl mx-auto py-16 md:py-24 px-4">
        <div
          className="relative w-full rounded-3xl overflow-hidden"
          style={{ aspectRatio: '21/9', minHeight: '280px' }}
        >
          <Image
            src="/img/atmospharisch.jpg"
            alt="Teneriffa — WELEDA Summer Campaign Location"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1200px"
          />

          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.20) 40%, transparent 70%)',
            }}
          />

          {/* Top-left location badge */}
          <div
            className="absolute top-4 left-4 px-3 py-1.5 rounded-full
                         text-xs font-semibold text-white flex items-center gap-1.5"
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.25)',
              backdropFilter: 'blur(8px)',
            }}
          >
            📍 Teneriffa
          </div>

          {/* Bottom-left headline */}
          <div className="absolute bottom-0 left-0 p-5 md:p-8">
            <p
              className="text-xs font-black uppercase tracking-widest mb-1"
              style={{ color: 'rgba(255,255,255,0.70)' }}
            >
              DAS FINALE
            </p>
            <h3 className="text-4xl font-black text-white mb-1.5">
              Teneriffa 🌴
            </h3>
            <p className="text-sm max-w-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Spannende Challenges, kreativer Content und echte Summer Vibes. 22. – 25.03.2026
            </p>
          </div>

          {/* Bottom-right badge */}
          <div
            className="absolute bottom-5 right-5 md:bottom-8 md:right-8
                         px-4 py-2 rounded-full text-sm font-bold text-white"
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.30)',
              backdropFilter: 'blur(8px)',
            }}
          >
            ✈️ All inclusive
          </div>
        </div>
      </section>
    </>
  )
}
