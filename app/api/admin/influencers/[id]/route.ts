import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { uploadToStorage } from '@/lib/upload'
import { verifyAdminAuth } from '@/lib/admin-auth'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PUT(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ success: false, error: 'unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const formData = await request.formData()
    const supabase = createServiceClient()

    const name = String(formData.get('name') ?? '').trim()
    const handle = String(formData.get('handle') ?? '').trim()
    const bio = String(formData.get('bio') ?? '').trim()
    const hashtagsRaw = String(formData.get('hashtags') ?? '').trim()
    const displayOrder = parseInt(String(formData.get('display_order') ?? '0'), 10)
    const isActive = String(formData.get('is_active')) === 'true'

    const hashtags = hashtagsRaw
      ? hashtagsRaw.split(',').map((t) => t.trim()).filter(Boolean)
      : []

    let photoUrl = String(formData.get('photo_url') ?? '')
    let videoUrl = String(formData.get('video_url') ?? '')

    const photoFile = formData.get('photo') as File | null
    const videoFile = formData.get('video') as File | null

    if (photoFile && photoFile.size > 0) {
      photoUrl = await uploadToStorage(photoFile, 'influencer-photos')
    }

    if (videoFile && videoFile.size > 0) {
      videoUrl = await uploadToStorage(videoFile, 'influencer-videos')
    }

    const updateData: Record<string, unknown> = {
      name,
      handle,
      bio: bio || null,
      hashtags,
      display_order: isNaN(displayOrder) ? 0 : displayOrder,
      is_active: isActive,
    }

    if (photoUrl) updateData.photo_url = photoUrl
    if (videoUrl) updateData.video_url = videoUrl

    const { data, error } = await supabase
      .from('influencers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ success: false, error: error.message })
    }

    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('[Admin/Influencers PUT]', err)
    return NextResponse.json({ success: false, error: 'server_error' })
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ success: false, error: 'unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = (await request.json()) as Record<string, unknown>
    const supabase = createServiceClient()

    const { data, error } = await supabase
      .from('influencers')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ success: false, error: error.message })
    }

    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('[Admin/Influencers PATCH]', err)
    return NextResponse.json({ success: false, error: 'server_error' })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ success: false, error: 'unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const supabase = createServiceClient()
    const { error } = await supabase.from('influencers').delete().eq('id', id)

    if (error) {
      return NextResponse.json({ success: false, error: error.message })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[Admin/Influencers DELETE]', err)
    return NextResponse.json({ success: false, error: 'server_error' })
  }
}
