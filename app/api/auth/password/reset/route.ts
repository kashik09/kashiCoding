import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/password'
import { isValidPassword } from '@/lib/auth-utils'

export const runtime = 'nodejs'

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export async function POST(request: NextRequest) {
  const contentType = request.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    return NextResponse.json(
      { error: 'Content-Type must be application/json' },
      { status: 415 }
    )
  }

  const body = await request.json().catch(() => null)
  const token = typeof body?.token === 'string' ? body.token.trim() : ''
  const newPassword = typeof body?.newPassword === 'string' ? body.newPassword : ''

  if (!token || !newPassword) {
    return NextResponse.json(
      { error: 'Token and new password are required' },
      { status: 400 }
    )
  }

  if (!isValidPassword(newPassword)) {
    return NextResponse.json(
      { error: 'Password must be at least 12 characters with uppercase, lowercase, number, and special character' },
      { status: 400 }
    )
  }

  const tokenHash = hashToken(token)
  const resetTokenRows = await prisma.$queryRaw<{ id: string; userId: string }[]>`
    SELECT "id", "userId"
    FROM "password_reset_tokens"
    WHERE "tokenHash" = ${tokenHash}
      AND "usedAt" IS NULL
      AND "expiresAt" > ${new Date()}
    LIMIT 1
  `
  const resetToken = resetTokenRows[0]

  if (!resetToken) {
    return NextResponse.json(
      { error: 'Invalid or expired reset link' },
      { status: 400 }
    )
  }

  const hashedPassword = await hashPassword(newPassword)
  const now = new Date()

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: {
        password: hashedPassword,
        mustResetPassword: false,
        passwordUpdatedAt: now,
      }
    }),
    prisma.$executeRaw`
      UPDATE "password_reset_tokens"
      SET "usedAt" = ${now}
      WHERE "id" = ${resetToken.id}
    `
  ])

  return NextResponse.json({ success: true })
}
