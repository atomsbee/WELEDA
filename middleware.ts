import { NextRequest, NextResponse } from 'next/server'

const SESSION_COOKIE = 'admin-session'
const SESSION_TOKEN = process.env.ADMIN_SESSION_TOKEN ?? 'weleda-admin-session-token'

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl

  // Only protect /admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // Allow the login page itself
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Check session cookie
  const sessionCookie = request.cookies.get(SESSION_COOKIE)
  if (!sessionCookie || sessionCookie.value !== SESSION_TOKEN) {
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
