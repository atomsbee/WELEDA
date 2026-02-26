import type { NextRequest } from 'next/server'
import { timingSafeEqual } from 'crypto'

/**
 * Safely extracts client IP from request headers.
 * Handles multiple proxies in x-forwarded-for.
 */
export function getClientIp(request: NextRequest): string {
  const xForwardedFor = request.headers.get('x-forwarded-for')
  if (xForwardedFor) {
    // Take the first (leftmost) IP which is the original client
    const ips = xForwardedFor.split(',').map((ip) => ip.trim())
    const firstIp = ips[0]
    if (firstIp && isValidIp(firstIp)) {
      return firstIp
    }
  }

  const xRealIp = request.headers.get('x-real-ip')
  if (xRealIp && isValidIp(xRealIp)) {
    return xRealIp
  }

  // Fallback for local development where no IP headers are set
  return '127.0.0.1'
}

function isValidIp(ip: string): boolean {
  // Basic IPv4 and IPv6 validation
  const ipv4 = /^(\d{1,3}\.){3}\d{1,3}$/
  const ipv6 = /^[0-9a-fA-F:]+$/
  return ipv4.test(ip) || ipv6.test(ip)
}

/**
 * Validates the honeypot field. Returns true if honeypot is filled (bot detected).
 */
export function isHoneypotFilled(value: string | null | undefined): boolean {
  return typeof value === 'string' && value.length > 0
}

/**
 * Constant-time string comparison to prevent timing attacks.
 */
export function constantTimeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, 'utf8')
    const bufB = Buffer.from(b, 'utf8')
    if (bufA.length !== bufB.length) {
      // Still do a comparison to avoid timing leak on length
      timingSafeEqual(bufA, Buffer.alloc(bufA.length))
      return false
    }
    return timingSafeEqual(bufA, bufB)
  } catch {
    return false
  }
}

/**
 * Mask email for display: ash***@gmail.com
 */
export function maskEmail(emailHash: string): string {
  // emailHash is a SHA-256 hash — we can't unmask it.
  // This function is for when we have the actual email (from voter_name context).
  // Returns a safe placeholder.
  return `${emailHash.slice(0, 3)}***@***.***`
}
