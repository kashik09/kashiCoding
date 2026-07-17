import NextAuth from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { authOptions } from "@/lib/auth-options"
import { checkRateLimit, getRateLimitHeaders, getRateLimitKey } from "@/lib/rate-limit"

const handler = NextAuth(authOptions)

export { handler as GET }

export async function POST(
  request: NextRequest,
  context: { params: { nextauth?: string[] } }
) {
  const rateLimit = checkRateLimit(
    getRateLimitKey(request, "auth:signin"),
    5,
    15 * 60 * 1000
  )
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts" },
      { status: 429, headers: getRateLimitHeaders(rateLimit) }
    )
  }

  return handler(request, context)
}
