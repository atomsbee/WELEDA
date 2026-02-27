import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { uploadFile } from '@/lib/upload'
import { verifyAdminAuth } from '@/lib/admin-auth'
import type { ApiResponse } from '@/types'

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ success: false, error: 'unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()

    const name = String(formData.get('name') ?? '').trim()
    const handle = String(formData.get('handle') ?? '').trim()
    const bio = String(formData.get('bio') ?? '').trim()
    const hashtagsRaw = String(formData.get('hashtags') ?? '').trim()
    const displayOrder = parseInt(String(formData.get('display_order') ?? '0'), 10)
    const isActive = String(formData.get('is_active')) === 'true'

    if (!name || !handle) {
      return NextResponse.json({ success: false, error: 'missing_required_fields' })
    }

    const hashtags = hashtagsRaw
      ? hashtagsRaw.split(',').map((t) => t.trim()).filter(Boolean)
      : []

    let photoUrl = String(formData.get('photo_url') ?? '')
    let videoUrl = String(formData.get('video_url') ?? '')

    const photoFile = formData.get('photo') as File | null
    const videoFile = formData.get('video') as File | null

    if (photoFile && photoFile.size > 0) {
      photoUrl = (await uploadFile(photoFile, 'photo')).url
    }

    if (videoFile && videoFile.size > 0) {
      videoUrl = (await uploadFile(videoFile, 'video')).url
    }

    if (!photoUrl || !videoUrl) {
      return NextResponse.json({ success: false, error: 'missing_media' })
    }

    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('influencers')
      .insert({
        name,
        handle,
        bio: bio || null,
        photo_url: photoUrl,
        video_url: videoUrl,
        hashtags,
        display_order: isNaN(displayOrder) ? 0 : displayOrder,
        is_active: isActive,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ success: false, error: error.message })
    }

    return NextResponse.json({ success: true, data } as ApiResponse)
  } catch (err) {
    console.error('[Admin/Influencers POST]', err)
    return NextResponse.json({ success: false, error: 'server_error' })
  }
}
