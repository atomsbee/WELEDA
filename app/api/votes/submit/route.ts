import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServiceClient } from '@/lib/supabase/server'
import { hashValue } from '@/lib/hash'
import { checkRateLimit } from '@/lib/rate-limit'
import { checkDisposableEmail } from '@/lib/blocklist'
import { getClientIp, isHoneypotFilled } from '@/lib/security'
import { revalidatePath } from 'next/cache'
import type { ApiResponse } from '@/types'

const voteBodySchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  influencerId: z.string().uuid(),
  honeypot: z.string().optional().default(''),
  recaptchaToken: z.string().optional(),
})

const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
}

function ok(data: ApiResponse): NextResponse {
  return NextResponse.json(data, { headers: securityHeaders })
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: unknown = await request.json()

    // 1. Honeypot check
    if (
      typeof body === 'object' &&
      body !== null &&
      'honeypot' in body &&
      isHoneypotFilled((body as Record<string, unknown>).honeypot as string)
    ) {
      return ok({ success: true, message: 'Vote registered' })
    }

    // 2. Validate
    const parsed = voteBodySchema.safeParse(body)
    if (!parsed.success) {
      console.error('[VOTE ERROR] Validation failed:', parsed.error.errors)
      return ok({ success: false, error: 'invalid_input' })
    }

    const { name, email, influencerId, recaptchaToken } = parsed.data

    // 3. IP extraction with dev fallback
    const ip = getClientIp(request)

    // 4. Rate limit
    const rateCheck = checkRateLimit(ip, 'vote')
    if (!rateCheck.allowed) {
      console.warn(`[Vote] Rate limited IP: ${ip.slice(0, 8)}...`)
      return ok({
        success: false,
        error: 'rate_limited',
        data: { retryAfter: rateCheck.retryAfter },
      })
    }

    // 5. Disposable email check
    if (checkDisposableEmail(email)) {
      return ok({ success: false, error: 'invalid_email' })
    }

    // 6. reCAPTCHA (skip gracefully if not configured)
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY
    if (recaptchaSecret && recaptchaToken) {
      try {
        const recaptchaRes = await fetch(
          `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${recaptchaToken}`,
          { method: 'POST' }
        )
        const recaptchaData = (await recaptchaRes.json()) as {
          success: boolean
          score?: number
        }
        if (
          !recaptchaData.success ||
          (recaptchaData.score !== undefined && recaptchaData.score < 0.5)
        ) {
          return ok({ success: false, error: 'captcha_failed' })
        }
      } catch {
        console.warn('[Vote] reCAPTCHA check failed, continuing')
      }
    }

    // 7. Hash email and IP
    const normalizedEmail = email.toLowerCase().trim()
    const emailHash = hashValue(normalizedEmail)
    const ipHash = hashValue(ip)

    const supabase = createServiceClient()

    // 8. Duplicate vote check
    const { data: existingVote, error: checkError } = await supabase
      .from('votes')
      .select('id')
      .eq('influencer_id', influencerId)
      .eq('email_hash', emailHash)
      .maybeSingle()

    if (checkError) {
      console.error('[VOTE ERROR] DB check error:', checkError.message)
      console.error('[VOTE ERROR STACK]', checkError)
      return ok({ success: false, error: 'server_error' })
    }

    if (existingVote) {
      return ok({ success: false, error: 'already_voted' })
    }

    // 9. Insert vote
    const { error: insertError } = await supabase.from('votes').insert({
      influencer_id: influencerId,
      voter_name: name,
      email_hash: emailHash,
      ip_hash: ipHash,
    })

    if (insertError) {
      if (insertError.code === '23505') {
        return ok({ success: false, error: 'already_voted' })
      }
      console.error('[VOTE ERROR] Insert error:', insertError.message)
      console.error('[VOTE ERROR STACK]', insertError)
      return ok({ success: false, error: 'server_error' })
    }

    // 10. Increment vote count via RPC
    const { error: rpcError } = await supabase.rpc('increment_vote_count', {
      p_influencer_id: influencerId,
    })

    if (rpcError) {
      console.error('[VOTE ERROR] RPC increment failed:', rpcError.message)
      // Vote was recorded — counter failed, non-fatal. Fall back to direct update.
      await supabase.rpc('increment_vote_count', { p_influencer_id: influencerId })
    }

    // 11. Fetch updated vote count
    const { data: updatedInfluencer } = await supabase
      .from('influencers')
      .select('vote_count')
      .eq('id', influencerId)
      .single()

    const newVoteCount = updatedInfluencer?.vote_count ?? null

    // 12. Revalidate home page so next load gets fresh data
    revalidatePath('/')

    return ok({
      success: true,
      message: 'Vote registered',
      data: { newVoteCount },
    })
  } catch (err) {
    console.error('[VOTE ERROR] Unexpected error:', err)
    console.error('[VOTE ERROR STACK]', err instanceof Error ? err.stack : err)
    return ok({ success: false, error: 'server_error' })
  }
}
