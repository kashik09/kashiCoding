import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { hashPassword, verifyPassword } from '@/lib/password'
import { checkRateLimit, getRateLimitHeaders, getRateLimitKey } from '@/lib/rate-limit'
import { isValidPassword } from '@/lib/auth-utils'

export async function POST(request: NextRequest) {
  const session = await getServerSession()

  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const userId = session.user.id

  try {
    const rateLimit = checkRateLimit(
      getRateLimitKey(request, 'auth:password-change'),
      5,
      15 * 60 * 1000
    )
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many password change attempts' },
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
    const { currentPassword, newPassword } = body as {
      currentPassword?: string
      newPassword?: string
    }

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Current and new passwords are required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    if (!user.password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Password change is not available for this account',
        },
        { status: 400 }
      )
    }

    const validCurrent = await verifyPassword(currentPassword, user.password)
    if (!validCurrent) {
      return NextResponse.json(
        { success: false, error: 'Current password is incorrect' },
        { status: 400 }
      )
    }

    if (!isValidPassword(newPassword)) {
      return NextResponse.json(
        { success: false, error: 'New password must be at least 12 characters with uppercase, lowercase, number, and special character' },
        { status: 400 }
      )
    }

    const hashed = await hashPassword(newPassword)

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashed,
        mustResetPassword: false,
        passwordUpdatedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully',
    })
  } catch (error) {
    console.error('Error changing password:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to change password' },
      { status: 500 }
    )
  }
}
