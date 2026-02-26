import { createServiceClient } from '@/lib/supabase/server'
import { randomUUID } from 'crypto'

type StorageBucket = 'influencer-photos' | 'influencer-videos'

/**
 * Uploads a file to Supabase Storage and returns the public URL.
 * Uses service role key — server-side only.
 */
export async function uploadToStorage(
  file: File,
  bucket: StorageBucket
): Promise<string> {
  const supabase = createServiceClient()

  const uniqueName = `${randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const { error } = await supabase.storage
    .from(bucket)
    .upload(uniqueName, buffer, {
      contentType: file.type,
      upsert: false,
    })

  if (error) {
    throw new Error(`Upload failed: ${error.message}`)
  }

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(uniqueName)

  if (!urlData?.publicUrl) {
    throw new Error('Failed to get public URL after upload')
  }

  return urlData.publicUrl
}

