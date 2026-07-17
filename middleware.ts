import { withAuth } from "next-auth/middleware"
import { NextResponse, type NextRequest } from "next/server"
import {
  ADMIN_DEVICE_ID_COOKIE,
  ADMIN_TRUST_DEVICE_COOKIE,
  ADMIN_STEPUP_COOKIE,
  ADMIN_LAST_ACTIVE_COOKIE,
  ADMIN_IDLE_TIMEOUT_SECONDS,
  verifySignedToken,
  hashValue,
  getRequestCountry,
  getRequestIp,
} from "@/lib/admin-security"

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"])
const allowedOrigins = new Set(
  (process.env.CSRF_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map(origin => origin.trim())
    .filter(Boolean)
)

const ADMIN_ROLES = new Set(["ADMIN", "OWNER", "MODERATOR", "EDITOR"])

type TrustedDevicePayload = {
  u: string
  d: string
  exp: number
  ip?: string
  c?: string
  ua?: string
}

type StepUpPayload = {
  u: string
  exp: number
}

async function isTrustedAdminDevice(req: NextRequest, userId: string): Promise<boolean> {
  const trustToken = req.cookies.get(ADMIN_TRUST_DEVICE_COOKIE)?.value
  const deviceId = req.cookies.get(ADMIN_DEVICE_ID_COOKIE)?.value
  if (!trustToken || !deviceId) return false

  try {
    const payload = await verifySignedToken<TrustedDevicePayload>(trustToken)
    if (!payload || payload.u !== userId || payload.d !== deviceId) return false

    const ip = getRequestIp(req.headers)
    if (payload.ip && ip) {
      const ipHash = await hashValue(ip)
      if (payload.ip !== ipHash) return false
    }

    const userAgent = req.headers.get("user-agent")
    if (payload.ua && userAgent) {
      const uaHash = await hashValue(userAgent)
      if (payload.ua !== uaHash) return false
    }

    const country = req.geo?.country || getRequestCountry(req.headers)
    if (payload.c && country && payload.c !== country) return false

    const validationUrl = new URL("/api/auth/trusted-devices/validate", req.url)
    const validationResponse = await fetch(validationUrl, {
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
    })
    if (!validationResponse.ok) return false
    const validationData = await validationResponse.json()
    if (!validationData?.ok) return false
  } catch {
    return false
  }

  return true
}

async function hasRecentStepUp(req: NextRequest, userId: string): Promise<boolean> {
  const stepUpToken = req.cookies.get(ADMIN_STEPUP_COOKIE)?.value
  if (!stepUpToken) return false
  try {
    const payload = await verifySignedToken<StepUpPayload>(stepUpToken)
    return !!payload && payload.u === userId
  } catch {
    return false
  }
}

function isIdleExpired(req: NextRequest): boolean {
  const lastActive = req.cookies.get(ADMIN_LAST_ACTIVE_COOKIE)?.value
  if (!lastActive) return true
  const lastActiveSeconds = Number(lastActive)
  if (!Number.isFinite(lastActiveSeconds)) return true
  const nowSeconds = Math.floor(Date.now() / 1000)
  return nowSeconds - lastActiveSeconds > ADMIN_IDLE_TIMEOUT_SECONDS
}

function shouldRequireStepUp(path: string): boolean {
  return (
    path.startsWith("/admin/users") ||
    path.startsWith("/admin/settings") ||
    path.startsWith("/admin/security") ||
    path.startsWith("/admin/orders")
  )
}

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

function addNoStoreHeaders(response: NextResponse, path: string): NextResponse {
  if (path.startsWith("/api/auth") || path.startsWith("/api/me")) {
    response.headers.set("Cache-Control", "no-store")
  }
  return response
}

// Paths allowed even when password reset is required
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

    // Check if user must reset password (skip for allowed paths)
    if (
      token?.mustResetPassword === true &&
      !isPasswordResetAllowedPath(path)
    ) {
      return NextResponse.redirect(new URL("/force-reset-password", req.url))
    }

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
          const response = NextResponse.json(
            { error: "Invalid CSRF origin" },
            { status: 403 }
          )
          return addNoStoreHeaders(response, path)
        }
      }

      return addNoStoreHeaders(NextResponse.next(), path)
    }

    // Protect Admin
    if (path.startsWith("/admin")) {
      if (!token) {
        const loginUrl = new URL("/login", req.url)
        loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname + req.nextUrl.search)
        return NextResponse.redirect(loginUrl)
      }

      const isAllowedRole = ADMIN_ROLES.has(token.role as string)
      if (!isAllowedRole) {
        return NextResponse.redirect(new URL("/", req.url))
      }

      const userId = (token.id as string) || (token.sub as string) || ""
      const has2FA = token.twoFactorEnabled === true && token.twoFactorVerified === true

      if (!has2FA && !path.startsWith("/admin/setup-2fa")) {
        return NextResponse.redirect(new URL("/admin/setup-2fa", req.url))
      }

      if (has2FA && path.startsWith("/admin/setup-2fa")) {
        return NextResponse.redirect(new URL("/admin", req.url))
      }

      if (has2FA && !path.startsWith("/admin/verify-2fa")) {
        const trusted = await isTrustedAdminDevice(req, userId)
        const idleExpired = isIdleExpired(req)
        if (!trusted || idleExpired) {
          const verifyUrl = new URL("/admin/verify-2fa", req.url)
          verifyUrl.searchParams.set("callbackUrl", req.nextUrl.pathname + req.nextUrl.search)
          return NextResponse.redirect(verifyUrl)
        }
      }

      if (has2FA && shouldRequireStepUp(path)) {
        const stepUpOk = await hasRecentStepUp(req, userId)
        if (!stepUpOk && !path.startsWith("/admin/verify-2fa")) {
          const verifyUrl = new URL("/admin/verify-2fa", req.url)
          verifyUrl.searchParams.set("callbackUrl", req.nextUrl.pathname + req.nextUrl.search)
          return NextResponse.redirect(verifyUrl)
        }
      }

      if (path.startsWith("/admin/users") || path.startsWith("/admin/settings")) {
        if (token.role !== "ADMIN" && token.role !== "OWNER") {
          return NextResponse.redirect(new URL("/admin", req.url))
        }
      }

      const response = NextResponse.next()
      if (!req.cookies.get(ADMIN_DEVICE_ID_COOKIE)?.value) {
        response.cookies.set(ADMIN_DEVICE_ID_COOKIE, globalThis.crypto.randomUUID(), {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 30,
        })
      }
      if (has2FA && !path.startsWith("/admin/verify-2fa")) {
        response.cookies.set(ADMIN_LAST_ACTIVE_COOKIE, Math.floor(Date.now() / 1000).toString(), {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        })
      }
      return response
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
  matcher: ["/admin/:path*", "/dashboard/:path*", "/api/:path*", "/force-reset-password"],
}
