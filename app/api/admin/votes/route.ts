import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { verifyAdminAuth } from '@/lib/admin-auth'

interface VoteWithInfluencer {
  id: string
  voter_name: string
  email_hash: string
  voted_at: string
  influencer_id: string
  influencers: {
    name: string
    handle: string
  } | null
}

function maskEmailHash(hash: string): string {
  // We only have the hash, so we produce a safe placeholder
  const short = hash.slice(0, 3)
  return `${short}***@***.***`
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ success: false, error: 'unauthorized' }, { status: 401 })
  }

  const { searchParams } = request.nextUrl
  const influencerId = searchParams.get('influencerId')
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '50', 10)))
  const offset = (page - 1) * limit

  try {
    const supabase = createServiceClient()

    let query = supabase
      .from('votes')
      .select('id, voter_name, email_hash, voted_at, influencer_id, influencers(name, handle)', {
        count: 'exact',
      })
      .order('voted_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (influencerId) {
      query = query.eq('influencer_id', influencerId)
    }

    const { data, count, error } = await query

    if (error) {
      return NextResponse.json({ success: false, error: error.message })
    }

    const votes = (data as VoteWithInfluencer[]).map((v) => ({
      id: v.id,
      voter_name: v.voter_name,
      email_masked: maskEmailHash(v.email_hash),
      influencer_id: v.influencer_id,
      influencer_name: v.influencers?.name ?? '–',
      influencer_handle: v.influencers?.handle ?? '–',
      voted_at: v.voted_at,
    }))

    return NextResponse.json({
      success: true,
      data: { votes, total: count ?? 0, page, limit },
    })
  } catch (err) {
    console.error('[Admin/Votes GET]', err)
    return NextResponse.json({ success: false, error: 'server_error' })
  }
}
