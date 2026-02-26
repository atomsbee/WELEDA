/**
 * Returns true if today is before the campaign end date.
 * Reads CAMPAIGN_END_DATE env var (format: YYYY-MM-DD).
 */
export function isCampaignActive(): boolean {
  const endDateStr = process.env.CAMPAIGN_END_DATE
  if (!endDateStr) return true // default active if not set

  const endDate = new Date(endDateStr)
  if (isNaN(endDate.getTime())) return true

  // Set end date to end of day
  endDate.setHours(23, 59, 59, 999)
  return new Date() <= endDate
}

export function getCampaignEndDate(): string | null {
  return process.env.CAMPAIGN_END_DATE ?? null
}

export function formatCampaignEndDate(): string | null {
  const endDateStr = process.env.CAMPAIGN_END_DATE
  if (!endDateStr) return null

  const endDate = new Date(endDateStr)
  if (isNaN(endDate.getTime())) return null

  return endDate.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
