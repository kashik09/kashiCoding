import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticator } from 'otplib'
import { checkRateLimit, getRateLimitHeaders, getRateLimitKey } from '@/lib/rate-limit'

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

    const body = await request.json()
    const { email, token } = body

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
        { success: false, error: 'User not found' },
        { status: 404 }
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
