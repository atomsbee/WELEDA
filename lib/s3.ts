import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'

const S3_REGION = process.env.AWS_REGION ?? 'eu-central-1'
const S3_BUCKET = process.env.AWS_S3_BUCKET ?? ''

let _client: S3Client | null = null

function getS3Client(): S3Client {
  if (!_client) {
    _client = new S3Client({
      region: S3_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
      },
    })
  }
  return _client
}

export interface S3UploadResult {
  url: string
  key: string
}

/**
 * Upload a File/Blob to S3 using multipart upload.
 * Returns the public URL.
 */
export async function uploadToS3(
  file: File | Blob,
  key: string,
  contentType: string
): Promise<S3UploadResult> {
  if (!S3_BUCKET) throw new Error('AWS_S3_BUCKET env var not set')

  const client = getS3Client()

  const upload = new Upload({
    client,
    params: {
      Bucket: S3_BUCKET,
      Key: key,
      Body: file,
      ContentType: contentType,
      ACL: 'public-read',
    },
  })

  await upload.done()

  const url = `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${key}`
  return { url, key }
}
