import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminAuth } from '@/lib/admin-auth'
import { uploadFile, UploadValidationError } from '@/lib/upload'

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ success: false, error: 'unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file || file.size === 0) {
      return NextResponse.json({ success: false, error: 'no_file' }, { status: 400 })
    }

    const result = await uploadFile(file, 'video')
    console.log(`[UPLOAD] Video uploaded to: ${result.storage}`)

    return NextResponse.json({ success: true, url: result.url, storage: result.storage })
  } catch (err) {
    if (err instanceof UploadValidationError) {
      return NextResponse.json(
        { success: false, error: err.code, ...err.meta },
        { status: 400 }
      )
    }
    console.error('[Upload/Video]', err)
    return NextResponse.json(
      { success: false, error: 'upload_failed', message: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
