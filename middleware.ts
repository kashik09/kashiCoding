import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

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

function hasSameSiteSignal(req: Request): boolean {
  const secFetchSite = req.headers.get("sec-fetch-site")
  return secFetchSite === "same-origin" || secFetchSite === "same-site"
}

function addNoStoreHeaders(response: NextResponse, path: string): NextResponse {
  if (path.startsWith("/api/auth")) {
    response.headers.set("Cache-Control", "no-store")
  }
  return response
}

const PASSWORD_RESET_ALLOWED_PATHS = [
  "/force-reset-password",
  "/api/auth/force-reset",
  "/api/auth/signout",
  "/api/auth/session",
  "/logout",
]

function isPasswordResetAllowedPath(path: string): boolean {
  return PASSWORD_RESET_ALLOWED_PATHS.some((p) => path.startsWith(p))
}

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Password reset required check
    if (
      token?.mustResetPassword === true &&
      !isPasswordResetAllowedPath(path)
    ) {
      return NextResponse.redirect(new URL("/force-reset-password", req.url))
    }

    // CSRF protection for API routes
    if (path.startsWith("/api")) {
      if (!SAFE_METHODS.has(req.method)) {
        const origin = req.headers.get("origin")
        const referer = req.headers.get("referer")
        const requestOrigin = req.nextUrl.origin
        const hasSameSite = hasSameSiteSignal(req)
        const originAllowed = origin ? isAllowedOrigin(origin, requestOrigin) : false
        const refererAllowed = referer ? isAllowedReferer(referer, requestOrigin) : false

        if (!(originAllowed || refererAllowed || hasSameSite)) {
          return addNoStoreHeaders(
            NextResponse.json({ error: "Invalid CSRF origin" }, { status: 403 }),
            path
          )
        }
      }
      return addNoStoreHeaders(NextResponse.next(), path)
    }

    // Admin route protection
    if (path.startsWith("/admin")) {
      if (!token) {
        const loginUrl = new URL("/login", req.url)
        loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname + req.nextUrl.search)
        return NextResponse.redirect(loginUrl)
      }

      if (token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url))
      }

      const has2FA = token.twoFactorEnabled === true && token.twoFactorVerified === true

      // Redirect to 2FA setup if not enabled
      if (!has2FA && !path.startsWith("/admin/setup-2fa")) {
        return NextResponse.redirect(new URL("/admin/setup-2fa", req.url))
      }

      // Redirect away from setup if already has 2FA
      if (has2FA && path.startsWith("/admin/setup-2fa")) {
        return NextResponse.redirect(new URL("/admin/verify-2fa", req.url))
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
  matcher: ["/admin/:path*", "/api/:path*", "/force-reset-password"],
}
