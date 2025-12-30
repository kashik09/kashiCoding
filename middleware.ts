import { withAuth } from "next-auth/middleware"
import { NextResponse, type NextRequest } from "next/server"

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"])
const allowedOrigins = new Set(
  (process.env.CSRF_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map(origin => origin.trim())
    .filter(Boolean)
)

function isAllowedOrigin(origin: string, requestOrigin: string): boolean {
  return origin === requestOrigin || allowedOrigins.has(origin)
}

function isAllowedReferer(referer: string, requestOrigin: string): boolean {
  try {
    return isAllowedOrigin(new URL(referer).origin, requestOrigin)
  } catch {
    return false
  }
}

function hasSameSiteSignal(req: NextRequest): boolean {
  const secFetchSite = req.headers.get("sec-fetch-site")
  return secFetchSite === "same-origin" || secFetchSite === "same-site"
}

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    if (path.startsWith("/api")) {
      if (!SAFE_METHODS.has(req.method)) {
        const origin = req.headers.get("origin")
        const referer = req.headers.get("referer")
        const requestOrigin = req.nextUrl.origin
        const hasSameSite = hasSameSiteSignal(req)
        const originAllowed = origin
          ? isAllowedOrigin(origin, requestOrigin)
          : false
        const refererAllowed = referer
          ? isAllowedReferer(referer, requestOrigin)
          : false

        if (!(originAllowed || refererAllowed || hasSameSite)) {
          return NextResponse.json(
            { error: "Invalid CSRF origin" },
            { status: 403 }
          )
        }
      }

      return NextResponse.next()
    }

    // Protect Admin
    if (path.startsWith("/admin")) {
      if (!token) {
        const loginUrl = new URL("/login", req.url)
        loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname + req.nextUrl.search)
        return NextResponse.redirect(loginUrl)
      }

      const isAllowedRole =
        token.role === "ADMIN" ||
        token.role === "OWNER" ||
        token.role === "MODERATOR" ||
        token.role === "EDITOR"
      if (!isAllowedRole) {
        return NextResponse.redirect(new URL("/", req.url))
      }

      // Enforce 2FA for admin users
      const has2FA = token.twoFactorEnabled === true && token.twoFactorVerified === true
      if (!has2FA && !path.startsWith("/admin/setup-2fa")) {
        return NextResponse.redirect(new URL("/admin/setup-2fa", req.url))
      }

      // Redirect away from setup if already configured
      if (has2FA && path.startsWith("/admin/setup-2fa")) {
        return NextResponse.redirect(new URL("/admin", req.url))
      }

      if (path.startsWith("/admin/users") || path.startsWith("/admin/settings")) {
        if (token.role !== "ADMIN" && token.role !== "OWNER") {
          return NextResponse.redirect(new URL("/admin", req.url))
        }
      }

      return NextResponse.next()
    }

    // Protect Dashboard
    if (path.startsWith("/dashboard")) {
      if (!token) {
        const loginUrl = new URL("/login", req.url)
        loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname + req.nextUrl.search)
        return NextResponse.redirect(loginUrl)
      }
      return NextResponse.next()
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        if (req.nextUrl.pathname.startsWith("/api")) {
          return true
        }

        return !!token
      },
    },
  }
)

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/api/:path*"],
}
