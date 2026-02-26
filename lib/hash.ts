import { createHash } from 'crypto'

/**
 * SHA-256 hash of input + salt.
 * Never logs or returns the input value.
 */
export function hashValue(input: string): string {
  const salt = process.env.SUPABASE_HASH_SALT
  if (!salt) {
    throw new Error('SUPABASE_HASH_SALT environment variable is not set')
  }
  return createHash('sha256')
    .update(input + salt)
    .digest('hex')
}
