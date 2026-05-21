import { NextRequest, NextResponse } from 'next/server'
import { authenticator } from 'otplib'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { checkRateLimit, getRateLimitHeaders, getRateLimitKey } from '@/lib/rate-limit'
import { createAuditLog } from '@/lib/audit-logger'
import { AuditAction } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const rateLimit = checkRateLimit(
      getRateLimitKey(request, 'auth:2fa:verify-session'),
      10,
      10 * 60 * 1000
    )
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many 2FA verification attempts' },
        { status: 429, headers: getRateLimitHeaders(rateLimit) }
      )
    }

    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        role: true,
        twoFactorEnabled: true,
        twoFactorSecret: true,
        backupCodes: true,
      },
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    if (!user.twoFactorEnabled || !user.twoFactorSecret) {
      return NextResponse.json(
        { success: false, error: '2FA not enabled for this user' },
        { status: 400 }
      )
    }

    const backupCodes = (user.backupCodes as string[]) || []
    const isBackupCode = backupCodes.includes(token)

    if (isBackupCode) {
      const updatedBackupCodes = backupCodes.filter(code => code !== token)
      await prisma.user.update({
        where: { id: user.id },
        data: { backupCodes: updatedBackupCodes },
      })
    } else {
      const isValid = authenticator.verify({
        token,
        secret: user.twoFactorSecret,
      })
      if (!isValid) {
        await createAuditLog({
          userId: user.id,
          action: AuditAction.USER_LOGIN,
          resource: '2FA',
          resourceId: user.id,
          details: { success: false, reason: 'INVALID_TOKEN' },
        })
        return NextResponse.json(
          { success: false, error: 'Invalid token' },
          { status: 400 }
        )
      }
    }

    await createAuditLog({
      userId: user.id,
      action: AuditAction.USER_LOGIN,
      resource: '2FA',
      resourceId: user.id,
      details: {
        success: true,
        backupCodeUsed: isBackupCode,
      },
    })

    return NextResponse.json({
      success: true,
      backupCodeUsed: isBackupCode,
    })
  } catch (error: any) {
    console.error('Error verifying 2FA session:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to verify 2FA' },
      { status: 500 }
    )
  }
}
