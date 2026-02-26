import { NextRequest } from 'next/server'

const SESSION_COOKIE = 'admin-session'
const SESSION_TOKEN = process.env.ADMIN_SESSION_TOKEN ?? 'weleda-admin-session-token'

/**
 * Verifies cookie-based admin session for API routes.
 * Returns true if the session cookie is valid.
 */
export function verifyAdminAuth(request: NextRequest): boolean {
  const cookie = request.cookies.get(SESSION_COOKIE)
  if (!cookie) return false
  return cookie.value === SESSION_TOKEN
}
