import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { hashPassword, verifyPassword } from '@/lib/password'
import { isValidPassword } from '@/lib/auth-utils'
import {
  checkRateLimit,
  getRateLimitHeaders,
  getRateLimitKey,
} from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const session = await getServerSession()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const rateLimit = checkRateLimit(
      getRateLimitKey(request, 'auth:force-reset'),
      5,
      15 * 60 * 1000
    )
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many attempts. Please try again later.' },
        { status: 429, headers: getRateLimitHeaders(rateLimit) }
      )
    }

    const contentType = request.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
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
        { error: 'Current and new passwords are required' },
        { status: 400 }
      )
    }

    if (!isValidPassword(newPassword)) {
      return NextResponse.json(
        { error: 'New password does not meet security requirements' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'User not found or password not set' },
        { status: 404 }
      )
    }

    const validCurrent = await verifyPassword(currentPassword, user.password)
    if (!validCurrent) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      )
    }

    const hashedPassword = await hashPassword(newPassword)

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        password: hashedPassword,
        mustResetPassword: false,
        passwordUpdatedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully',
    })
  } catch (error) {
    console.error('Force reset password error:', error)
    return NextResponse.json(
      { error: 'Failed to update password' },
      { status: 500 }
    )
  }
}
