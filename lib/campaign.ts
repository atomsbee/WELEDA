export type CampaignPhase = 'pre' | 'voting' | 'ended'

/**
 * Reads campaign phase from the Supabase `campaign_settings` table.
 * Toggle phase in the admin dashboard to control the campaign state.
 *
 * - 'pre'    → Before voting starts (Bewerbungsphase)
 * - 'voting' → Voting is live
 * - 'ended'  → Voting is over
 */
export async function getCampaignPhase(): Promise<CampaignPhase> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) return 'pre'

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/campaign_settings?id=eq.1&select=phase`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        next: { revalidate: 30 },
      }
    )

    if (!res.ok) return 'pre'

    const rows = await res.json()
    if (!Array.isArray(rows) || rows.length === 0) return 'pre'

    const phase = rows[0].phase
    if (phase === 'pre' || phase === 'voting' || phase === 'ended') return phase
    return 'pre'
  } catch {
    return 'pre'
  }
}
