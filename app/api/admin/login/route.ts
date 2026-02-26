import { NextRequest, NextResponse } from 'next/server'
import { constantTimeCompare } from '@/lib/security'

const SESSION_COOKIE = 'admin-session'
const SESSION_TOKEN = process.env.ADMIN_SESSION_TOKEN ?? 'weleda-admin-session-token'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as { username?: string; password?: string }

    const username = (body.username ?? '').trim()
    const password = body.password ?? ''

    const expectedUsername = process.env.ADMIN_USERNAME ?? 'admin'
    const expectedPassword = process.env.ADMIN_PASSWORD ?? ''

    const valid =
      constantTimeCompare(username, expectedUsername) &&
      constantTimeCompare(password, expectedPassword)

    if (!valid) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 })
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set(SESSION_COOKIE, SESSION_TOKEN, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8 hours
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json({ success: false, error: 'server_error' }, { status: 500 })
  }
}
