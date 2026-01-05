import { NextRequest, NextResponse } from 'next/server'
import { createHash, randomBytes, randomUUID } from 'crypto'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, getRateLimitKey } from '@/lib/rate-limit'
import { isValidEmail, normalizeEmail } from '@/lib/auth-utils'
import { getResendConfig } from '@/lib/resend'

export const runtime = 'nodejs'

const RESET_TOKEN_TTL_MS = 30 * 60 * 1000
const REQUEST_LIMIT = 5
const REQUEST_WINDOW_MS = 15 * 60 * 1000
const EMAIL_LIMIT = 3

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

function buildResetUrl(token: string): string | null {
  const baseUrl = process.env.NEXTAUTH_URL?.trim()
  if (!baseUrl) return null
  return `${baseUrl.replace(/\/$/, '')}/reset-password/${token}`
}

function successResponse() {
  return NextResponse.json({
    success: true,
    message: 'If an account exists, we emailed you.'
  })
}

export async function POST(request: NextRequest) {
  try {
    const ipRateLimit = checkRateLimit(
      getRateLimitKey(request, 'auth:password-request'),
      REQUEST_LIMIT,
      REQUEST_WINDOW_MS
    )
    if (!ipRateLimit.allowed) {
      return successResponse()
    }

    const contentType = request.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 415 }
      )
    }

    const body = await request.json().catch(() => null)
    const email = normalizeEmail(body?.email)
    if (!email || !isValidEmail(email)) {
      return successResponse()
    }

    const emailRateLimit = checkRateLimit(
      `auth:password-request:email:${email}`,
      EMAIL_LIMIT,
      REQUEST_WINDOW_MS
    )
    if (!emailRateLimit.allowed) {
      return successResponse()
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })
    if (!user) {
      return successResponse()
    }

    const resetToken = randomBytes(32).toString('base64url')
    const tokenHash = hashToken(resetToken)
    const now = new Date()
    const expiresAt = new Date(now.getTime() + RESET_TOKEN_TTL_MS)

    const tokenId = randomUUID()
    await prisma.$transaction([
      prisma.$executeRaw`
        UPDATE "password_reset_tokens"
        SET "usedAt" = ${now}
        WHERE "userId" = ${user.id} AND "usedAt" IS NULL
      `,
      prisma.$executeRaw`
        INSERT INTO "password_reset_tokens" ("id", "userId", "tokenHash", "expiresAt", "createdAt")
        VALUES (${tokenId}, ${user.id}, ${tokenHash}, ${expiresAt}, ${now})
      `
    ])

    const resetUrl = buildResetUrl(resetToken)
    const resendConfig = getResendConfig()
    if (resetUrl && resendConfig.resend && resendConfig.from) {
      try {
        await resendConfig.resend.emails.send({
          from: resendConfig.from,
          to: user.email,
          subject: 'Reset your password',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #111827;">Reset your password</h2>
              <p>We received a request to reset your password.</p>
              <p>
                <a href="${resetUrl}" style="display: inline-block; background: #111827; color: #ffffff; padding: 12px 18px; border-radius: 6px; text-decoration: none;">
                  Reset password
                </a>
              </p>
              <p>This link expires in 30 minutes. If you didn&apos;t request this, you can safely ignore this email.</p>
            </div>
          `
        })
      } catch {
        return successResponse()
      }
    }

    return successResponse()
  } catch {
    return successResponse()
  }
}
