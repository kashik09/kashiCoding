import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticator } from 'otplib'
import { checkRateLimit, getRateLimitHeaders, getRateLimitKey } from '@/lib/rate-limit'
import { normalizeEmail } from '@/lib/auth-utils'

// POST /api/auth/2fa/validate - Validate TOTP during login
export async function POST(request: NextRequest) {
  try {
    const rateLimit = checkRateLimit(
      getRateLimitKey(request, 'auth:2fa:validate'),
      10,
      10 * 60 * 1000
    )
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many 2FA validation attempts' },
        { status: 429, headers: getRateLimitHeaders(rateLimit) }
      )
    }

    const contentType = request.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      return NextResponse.json(
        { success: false, error: 'Content-Type must be application/json' },
        { status: 415 }
      )
    }

    const body = await request.json().catch(() => null)
    const email = normalizeEmail(body?.email)
    const token = typeof body?.token === 'string' ? body.token.trim() : ''

    if (!email || !token) {
      return NextResponse.json(
        { success: false, error: 'Email and token are required' },
        { status: 400 }
      )
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        twoFactorSecret: true,
        twoFactorEnabled: true,
        backupCodes: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or token' },
        { status: 400 }
      )
    }

    if (!user.twoFactorEnabled || !user.twoFactorSecret) {
      return NextResponse.json(
        { success: false, error: '2FA not enabled for this user' },
        { status: 400 }
      )
    }

    // Check if token is a backup code
    const backupCodes = (user.backupCodes as string[]) || []
    const isBackupCode = backupCodes.includes(token)

    if (isBackupCode) {
      // Remove used backup code
      const updatedBackupCodes = backupCodes.filter(code => code !== token)
      await prisma.user.update({
        where: { id: user.id },
        data: { backupCodes: updatedBackupCodes }
      })

      return NextResponse.json({
        success: true,
        message: 'Backup code validated successfully',
        backupCodeUsed: true
      })
    }

    // Verify TOTP token
    const isValid = authenticator.verify({
      token,
      secret: user.twoFactorSecret
    })

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Token validated successfully',
      backupCodeUsed: false
    })
  } catch (error: any) {
    console.error('Error validating 2FA:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to validate 2FA' },
      { status: 500 }
    )
  }
}
