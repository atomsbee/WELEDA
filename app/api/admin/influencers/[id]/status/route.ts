import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { verifyAdminAuth } from '@/lib/admin-auth'

interface RouteParams {
  params: { id: string }
}

export async function PATCH(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ success: false, error: 'unauthorized' }, { status: 401 })
  }

  try {
    const { id } = params
    const body = (await request.json()) as { is_active?: boolean }

    if (typeof body.is_active !== 'boolean') {
      return NextResponse.json({ success: false, error: 'is_active must be a boolean' }, { status: 400 })
    }

    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('influencers')
      .update({ is_active: body.is_active })
      .eq('id', id)
      .select('id, is_active')
      .single()

    if (error) {
      console.error('[Admin/Status PATCH]', error.message)
      return NextResponse.json({ success: false, error: error.message })
    }

    return NextResponse.json({ success: true, is_active: data.is_active })
  } catch (err) {
    console.error('[Admin/Status PATCH]', err)
    return NextResponse.json({ success: false, error: 'server_error' })
  }
}
