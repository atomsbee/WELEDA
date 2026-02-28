import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { verifyAdminAuth } from '@/lib/admin-auth'
import { getCategoryConfig } from '@/lib/config/categories'

interface VoteWithInfluencer {
  voter_name: string
  email_hash: string
  voted_at: string
  category: string | null
  influencers: {
    name: string
    handle: string
  } | null
}

function maskEmailHash(hash: string): string {
  return `${hash.slice(0, 3)}***@***.***`
}

function escapeCsv(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ success: false, error: 'unauthorized' }, { status: 401 })
  }

  const { searchParams } = request.nextUrl
  const influencerId = searchParams.get('influencerId')

  try {
    const supabase = createServiceClient()

    let query = supabase
      .from('votes')
      .select('voter_name, email_hash, voted_at, category, influencers(name, handle)')
      .order('voted_at', { ascending: false })

    if (influencerId) {
      query = query.eq('influencer_id', influencerId)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ success: false, error: error.message })
    }

    const rows = data as unknown as VoteWithInfluencer[]
    const today = new Date().toISOString().slice(0, 10)
    // Use influencer name in filename if filtering by one influencer
    let influencerSlug = 'all'
    if (influencerId) {
      const matchedInfluencer = rows[0]?.influencers?.name
      influencerSlug = matchedInfluencer
        ? matchedInfluencer.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        : influencerId.slice(0, 8)
    }
    const filename = `weleda-votes-${influencerSlug}-${today}.csv`

    const header = 'Voter Name,Voter ID (anonymised),Creator,Handle,Category,Date,Time'
    const lines = rows.map((v) => {
      const votedAt = new Date(v.voted_at)
      const day = String(votedAt.getDate()).padStart(2, '0')
      const month = String(votedAt.getMonth() + 1).padStart(2, '0')
      const year = votedAt.getFullYear()
      const hours = String(votedAt.getHours()).padStart(2, '0')
      const minutes = String(votedAt.getMinutes()).padStart(2, '0')
      const categoryLabel = getCategoryConfig(v.category)?.label ?? v.category ?? ''
      return [
        escapeCsv(v.voter_name),
        escapeCsv(maskEmailHash(v.email_hash)),
        escapeCsv(v.influencers?.name ?? ''),
        escapeCsv(v.influencers?.handle ?? ''),
        escapeCsv(categoryLabel),
        escapeCsv(`${day}.${month}.${year}`),
        escapeCsv(`${hours}:${minutes}`),
      ].join(',')
    })

    // UTF-8 BOM ensures Excel opens the file with correct encoding
    const csv = '\uFEFF' + [header, ...lines].join('\r\n')

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    console.error('[Admin/Votes Export]', err)
    return NextResponse.json({ success: false, error: 'server_error' })
  }
}
