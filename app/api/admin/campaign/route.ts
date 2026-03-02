import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { verifyAdminAuth } from '@/lib/admin-auth'

const VALID_PHASES = ['pre', 'voting', 'ended'] as const

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ success: false, error: 'unauthorized' }, { status: 401 })
  }

  try {
    const body = (await request.json()) as { phase?: string }

    if (!body.phase || !VALID_PHASES.includes(body.phase as typeof VALID_PHASES[number])) {
      return NextResponse.json(
        { success: false, error: 'phase must be one of: pre, voting, ended' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('campaign_settings')
      .update({ phase: body.phase, updated_at: new Date().toISOString() })
      .eq('id', 1)
      .select('phase')
      .single()

    if (error) {
      console.error('[Admin/Campaign PATCH]', error.message)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, phase: data.phase })
  } catch (err) {
    console.error('[Admin/Campaign PATCH]', err)
    return NextResponse.json({ success: false, error: 'server_error' }, { status: 500 })
  }
}
