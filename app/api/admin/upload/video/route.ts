import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminAuth } from '@/lib/admin-auth'
import { uploadToS3 } from '@/lib/s3'
import { uploadToStorage } from '@/lib/upload'
import crypto from 'crypto'

const ALLOWED_TYPES = ['video/mp4', 'video/quicktime', 'video/webm']
const MAX_SIZE = 200 * 1024 * 1024 // 200 MB

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ success: false, error: 'unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file || file.size === 0) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ success: false, error: 'Invalid file type. Use MP4, MOV or WebM.' }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ success: false, error: 'File too large. Max 200 MB.' }, { status: 400 })
    }

    // Use S3 if configured, otherwise fall back to Supabase Storage
    const useS3 = !!(process.env.AWS_S3_BUCKET && process.env.AWS_ACCESS_KEY_ID)

    let url: string

    if (useS3) {
      const typeMap: Record<string, string> = {
        'video/mp4': 'mp4',
        'video/quicktime': 'mov',
        'video/webm': 'webm',
      }
      const ext = typeMap[file.type] ?? 'mp4'
      const key = `influencer-videos/${crypto.randomUUID()}.${ext}`
      const result = await uploadToS3(file, key, file.type)
      url = result.url
    } else {
      url = await uploadToStorage(file, 'influencer-videos')
    }

    return NextResponse.json({ success: true, url })
  } catch (err) {
    console.error('[Upload/Video]', err)
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 })
  }
}
