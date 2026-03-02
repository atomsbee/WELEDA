/**
 * Reads campaign active state from the Supabase `campaign_settings` table.
 * Toggle is_active in the Supabase dashboard to control the campaign.
 */
export async function isCampaignActive(): Promise<boolean> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) return false

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/campaign_settings?id=eq.1&select=is_active`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        next: { revalidate: 30 },
      }
    )

    if (!res.ok) return false

    const rows = await res.json()
    if (!Array.isArray(rows) || rows.length === 0) return false

    return rows[0].is_active === true
  } catch {
    return false
  }
}
