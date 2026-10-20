import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth?.token
    const pathname = req.nextUrl.pathname

    // For admin API routes, return 401 JSON if not ADMIN
    if (pathname.startsWith('/api/admin')) {
      if (!token || token.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Unauthorized: Admin privileges required' },
          { status: 401 }
        )
      }
    }

    // For admin UI pages, enforce ADMIN role
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
      if (token?.role !== 'ADMIN') {
        const url = req.nextUrl.clone()
        url.pathname = '/admin/login'
        url.searchParams.set('error', 'AccessDenied')
        return NextResponse.redirect(url)
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname
        // Public admin login page
        if (pathname === '/admin/login') return true
        // Handle admin APIs inside middleware handler for JSON 401
        if (pathname.startsWith('/api/admin')) return true
        // Enforce ADMIN role for dashboard UI
        return token?.role === 'ADMIN'
      }
    },
    pages: {
      signIn: '/admin/login'
    }
  }
)

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*']
}

