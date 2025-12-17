import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Admin routes protection
    if (path.startsWith("/admin")) {
      if (!token) {
        return NextResponse.redirect(new URL("/login?callbackUrl=/admin", req.url))
      }

      // Check if user has admin access
      const allowedRoles = ['ADMIN', 'OWNER', 'MODERATOR', 'EDITOR']
      if (!allowedRoles.includes(token.role as string)) {
        return NextResponse.redirect(new URL("/", req.url))
      }

      // Role-based access control for specific routes
      if (path.startsWith("/admin/users") || path.startsWith("/admin/settings")) {
        // Only ADMIN and OWNER can access users and settings
        if (!['ADMIN', 'OWNER'].includes(token.role as string)) {
          return NextResponse.redirect(new URL("/admin", req.url))
        }
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ["/admin/:path*"],
}
