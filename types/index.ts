export interface Influencer {
  id: string
  name: string
  handle: string
  bio: string | null
  photo_url: string
  video_url: string
  hashtags: string[]
  vote_count: number
  is_active: boolean
  display_order: number
  created_at: string
}

export interface Vote {
  id: string
  influencer_id: string
  voter_name: string
  email_hash: string
  ip_hash: string
  voted_at: string
}

export interface VoteFormData {
  name: string
  email: string
  influencerId: string
  honeypot?: string
  recaptchaToken?: string
  gdprConsent: boolean
}

// Admin view — includes masked email, joined with influencer name
export interface AdminVote {
  id: string
  voter_name: string
  email_masked: string
  influencer_id: string
  influencer_name: string
  influencer_handle: string
  voted_at: string
}

export interface AdminInfluencer extends Influencer {
  // same as Influencer but used in admin context
}

export interface ApiResponse<T = unknown> {
  success: boolean
  error?: string
  data?: T
  message?: string
}
