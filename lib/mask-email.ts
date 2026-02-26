/**
 * Masks an email hash for display.
 * Since we only store the SHA-256 hash (never plaintext email),
 * we show the first 8 chars of the hash as an anonymised voter ID.
 * This is GDPR-compliant: hash ≠ email.
 */
export function maskEmail(emailHash: string): string {
  return emailHash.substring(0, 8) + '••••••••'
}
