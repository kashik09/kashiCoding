import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'
import { authenticator } from 'otplib'
import { checkRateLimit, getRateLimitHeaders, getRateLimitKey } from '@/lib/rate-limit'

// POST /api/auth/2fa/verify - Verify TOTP code and enable 2FA
export async function POST(request: NextRequest) {
  try {
    const rateLimit = checkRateLimit(
      getRateLimitKey(request, 'auth:2fa:verify'),
      10,
      10 * 60 * 1000
    )
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many 2FA verification attempts' },
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

    const contentType = request.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      return NextResponse.json(
        { success: false, error: 'Content-Type must be application/json' },
        { status: 415 }
      )
    }

    const body = await request.json().catch(() => null)
    const token = typeof body?.token === 'string' ? body.token.trim() : ''

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token is required' },
        { status: 400 }
      )
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        twoFactorSecret: true,
        role: true
      }
    })

    if (!user || !['ADMIN', 'OWNER', 'MODERATOR', 'EDITOR'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    if (!user.twoFactorSecret) {
      return NextResponse.json(
        { success: false, error: '2FA setup not initiated' },
        { status: 400 }
      )
    }

    // Verify token
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

    // Enable 2FA
    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorEnabled: true,
        twoFactorVerified: true
      }
    })

    return NextResponse.json({
      success: true,
      message: '2FA enabled successfully'
    })
  } catch (error: any) {
    console.error('Error verifying 2FA:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to verify 2FA' },
      { status: 500 }
    )
  }
}
