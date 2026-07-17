import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { checkRateLimit, getRateLimitHeaders, getRateLimitKey } from '@/lib/rate-limit'

// POST /api/auth/2fa/disable - Disable 2FA (Owner only)
export async function POST(request: NextRequest) {
  try {
    const rateLimit = checkRateLimit(
      getRateLimitKey(request, 'auth:2fa:disable'),
      5,
      15 * 60 * 1000
    )
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many 2FA disable attempts' },
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

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        role: true,
        twoFactorEnabled: true
      }
    })

    // Only OWNER can disable 2FA
    if (!user || user.role !== 'OWNER') {
      return NextResponse.json(
        { success: false, error: 'Only the site owner can disable 2FA' },
        { status: 403 }
      )
    }

    if (!user.twoFactorEnabled) {
      return NextResponse.json(
        { success: false, error: '2FA is not enabled' },
        { status: 400 }
      )
    }

    // Disable 2FA
    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
        twoFactorVerified: false,
        backupCodes: Prisma.JsonNull
      }
    })

    return NextResponse.json({
      success: true,
      message: '2FA disabled successfully'
    })
  } catch (error: any) {
    console.error('Error disabling 2FA:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to disable 2FA' },
      { status: 500 }
    )
  }
}
