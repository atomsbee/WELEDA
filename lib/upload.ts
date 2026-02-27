import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { createServiceClient } from '@/lib/supabase/server'
import { randomUUID } from 'crypto'

// ── Config detection ─────────────────────────────────────────────────────────

const hasS3Config = !!(
  process.env.AWS_REGION &&
  process.env.AWS_ACCESS_KEY_ID &&
  process.env.AWS_SECRET_ACCESS_KEY &&
  process.env.AWS_S3_BUCKET
)

if (process.env.NODE_ENV === 'development') {
  console.log('[UPLOAD CONFIG]', {
    storage: hasS3Config ? 'AWS S3' : 'Supabase',
    bucket: hasS3Config
      ? process.env.AWS_S3_BUCKET
      : 'influencer-photos (Supabase)',
    region: process.env.AWS_REGION ?? 'N/A',
  })
}

// ── Lazy S3 client ────────────────────────────────────────────────────────────

let _s3Client: S3Client | null = null

function getS3Client(): S3Client {
  if (!_s3Client) {
    _s3Client = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    })
  }
  return _s3Client
}

// ── Validation ────────────────────────────────────────────────────────────────

const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm']
const MAX_PHOTO_BYTES = 5 * 1024 * 1024      // 5 MB
const MAX_VIDEO_BYTES = 500 * 1024 * 1024    // 500 MB

export class UploadValidationError extends Error {
  code: string
  meta: Record<string, unknown>
  constructor(code: string, message: string, meta: Record<string, unknown> = {}) {
    super(message)
    this.code = code
    this.meta = meta
  }
}

function validateFile(file: File, type: 'photo' | 'video'): void {
  if (type === 'photo') {
    if (!PHOTO_TYPES.includes(file.type)) {
      throw new UploadValidationError('invalid_file_type', 'Invalid file type', {
        allowed: ['jpg', 'png', 'webp'],
      })
    }
    if (file.size > MAX_PHOTO_BYTES) {
      throw new UploadValidationError('file_too_large', 'File too large', { maxSize: '5MB' })
    }
  } else {
    if (!VIDEO_TYPES.includes(file.type)) {
      throw new UploadValidationError('invalid_file_type', 'Invalid file type', {
        allowed: ['mp4', 'mov', 'webm'],
      })
    }
    if (file.size > MAX_VIDEO_BYTES) {
      throw new UploadValidationError('file_too_large', 'File too large', { maxSize: '500MB' })
    }
  }
}

// ── Filename sanitizer ────────────────────────────────────────────────────────

function sanitizeFilename(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9.]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// ── Upload result ─────────────────────────────────────────────────────────────

export interface UploadResult {
  url: string
  storage: 's3' | 'supabase'
}

// ── Public unified upload function ────────────────────────────────────────────

/**
 * Upload a file to S3 (if configured) or Supabase Storage (photos only fallback).
 * Validates type and size before uploading.
 */
export async function uploadFile(
  file: File,
  type: 'photo' | 'video'
): Promise<UploadResult> {
  validateFile(file, type)

  if (hasS3Config) {
    return s3Upload(file, type)
  }

  if (type === 'video') {
    throw new Error(
      'Video upload requires AWS S3. Please configure AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY and AWS_S3_BUCKET.'
    )
  }

  return supabaseUpload(file)
}

// ── S3 implementation ─────────────────────────────────────────────────────────

async function s3Upload(file: File, type: 'photo' | 'video'): Promise<UploadResult> {
  const bucket = process.env.AWS_S3_BUCKET!
  const region = process.env.AWS_REGION!
  const publicUrl =
    process.env.AWS_S3_PUBLIC_URL?.replace(/\/$/, '') ??
    `https://${bucket}.s3.${region}.amazonaws.com`

  const folder = type === 'photo' ? 'images' : 'videos'
  const safe = sanitizeFilename(file.name)
  const key = `${folder}/${randomUUID()}-${safe}`

  const upload = new Upload({
    client: getS3Client(),
    params: {
      Bucket: bucket,
      Key: key,
      Body: file,
      ContentType: file.type,
      // ACL omitted — bucket uses "Bucket owner enforced" (no ACLs).
      // Public read is granted via bucket policy instead.
    },
  })

  await upload.done()

  console.log(`[UPLOAD] ${type} uploaded to S3: ${key}`)
  return { url: `${publicUrl}/${key}`, storage: 's3' }
}

// ── Supabase implementation ───────────────────────────────────────────────────

async function supabaseUpload(file: File): Promise<UploadResult> {
  const supabase = createServiceClient()
  const safe = sanitizeFilename(file.name)
  const uniqueName = `${randomUUID()}-${safe}`

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const { error } = await supabase.storage
    .from('influencer-photos')
    .upload(uniqueName, buffer, { contentType: file.type, upsert: false })

  if (error) throw new Error(`Supabase upload failed: ${error.message}`)

  const { data: urlData } = supabase.storage
    .from('influencer-photos')
    .getPublicUrl(uniqueName)

  if (!urlData?.publicUrl) throw new Error('Failed to get public URL after upload')

  console.log(`[UPLOAD] photo uploaded to Supabase: ${uniqueName}`)
  return { url: urlData.publicUrl, storage: 'supabase' }
}

// ── Backward-compat shim for influencer API routes ────────────────────────────

/** @deprecated Use uploadFile() instead */
export async function uploadToStorage(
  file: File,
  bucket: 'influencer-photos' | 'influencer-videos'
): Promise<string> {
  const type = bucket === 'influencer-photos' ? 'photo' : 'video'
  const result = await uploadFile(file, type)
  return result.url
}
