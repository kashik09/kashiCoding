import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'
import { authenticator } from 'otplib'
import QRCode from 'qrcode'
import { checkRateLimit, getRateLimitHeaders, getRateLimitKey } from '@/lib/rate-limit'

// POST /api/auth/2fa/setup - Generate 2FA secret and QR code
export async function POST(request: NextRequest) {
  try {
    const rateLimit = checkRateLimit(
      getRateLimitKey(request, 'auth:2fa:setup'),
      5,
      10 * 60 * 1000
    )
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many 2FA setup attempts' },
        { status: 429, headers: getRateLimitHeaders(rateLimit) }
      )
    }

    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin/owner/moderator/editor
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        role: true,
        twoFactorEnabled: true,
        twoFactorVerified: true
      }
    })

    if (!user || !['ADMIN', 'OWNER', 'MODERATOR', 'EDITOR'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Only admin users can set up 2FA' },
        { status: 403 }
      )
    }

    // Generate secret
    const secret = authenticator.generateSecret()

    // Generate OTP auth URL
    const otpauthUrl = authenticator.keyuri(
      session.user.email,
      'Portfolio CMS',
      secret
    )

    // Generate QR code
    const qrCode = await QRCode.toDataURL(otpauthUrl)

    // Generate backup codes
    const backupCodes = Array.from({ length: 10 }, () =>
      Math.random().toString(36).substring(2, 10).toUpperCase()
    )

    // Save secret and backup codes (not verified yet)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorSecret: secret,
        twoFactorEnabled: false, // Not enabled until verified
        twoFactorVerified: false,
        backupCodes: backupCodes
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        secret,
        qrCode,
        backupCodes
      }
    })
  } catch (error: any) {
    console.error('Error setting up 2FA:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to set up 2FA' },
      { status: 500 }
    )
  }
}
