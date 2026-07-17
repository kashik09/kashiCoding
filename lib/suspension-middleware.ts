/**
 * Suspension Enforcement Middleware
 *
 * Use this to protect routes/actions from suspended users
 */

import { getServerSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export interface SuspensionCheck {
  isSuspended: boolean
  reason?: string
  suspendedAt?: Date
}

/**
 * Check if user is suspended
 */
export async function checkUserSuspension(userId: string): Promise<SuspensionCheck> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      accountStatus: true,
      suspendedAt: true,
      suspendedReason: true,
    },
  })

  if (!user) {
    return { isSuspended: false }
  }

  if (user.accountStatus === 'SUSPENDED') {
    return {
      isSuspended: true,
      reason: user.suspendedReason || 'Account suspended by administrator',
      suspendedAt: user.suspendedAt || undefined,
    }
  }

  return { isSuspended: false }
}

/**
 * Middleware guard: Reject suspended users
 * Use at the beginning of protected API routes
 */
export async function requireNotSuspended(
  request: NextRequest
): Promise<NextResponse | null> {
  const session = await getServerSession()

  if (!session?.user?.id) {
    return null // Let auth middleware handle this
  }

  const suspension = await checkUserSuspension(session.user.id)

  if (suspension.isSuspended) {
    return NextResponse.json(
      {
        error: 'Account suspended',
        reason: suspension.reason,
        suspendedAt: suspension.suspendedAt,
        message:
          'Your account has been suspended. Please contact support for more information.',
      },
      { status: 403 }
    )
  }

  return null // Not suspended, allow request to proceed
}

/**
 * Check if user can download a product (not suspended + has valid license)
 */
export async function canUserDownload(
  userId: string,
  licenseId: string
): Promise<{
  allowed: boolean
  reason?: string
}> {
  // Check suspension
  const suspension = await checkUserSuspension(userId)
  if (suspension.isSuspended) {
    return {
      allowed: false,
      reason: 'Account suspended: ' + (suspension.reason || 'Contact support'),
    }
  }

  // Check license status
  const license = await prisma.license.findUnique({
    where: { id: licenseId },
    select: {
      status: true,
      userId: true,
      abuseDetected: true,
      abuseFlagged: true,
    },
  })

  if (!license) {
    return { allowed: false, reason: 'License not found' }
  }

  if (license.userId !== userId) {
    return { allowed: false, reason: 'License belongs to another user' }
  }

  if (license.status !== 'ACTIVE') {
    return {
      allowed: false,
      reason: `License is ${license.status.toLowerCase()}`,
    }
  }

  if (license.abuseFlagged || license.abuseDetected) {
    return {
      allowed: false,
      reason: 'License flagged for abuse. Contact support to resolve.',
    }
  }

  return { allowed: true }
}

/**
 * Check if user can make purchases (not suspended)
 */
export async function canUserPurchase(userId: string): Promise<{
  allowed: boolean
  reason?: string
}> {
  const suspension = await checkUserSuspension(userId)

  if (suspension.isSuspended) {
    return {
      allowed: false,
      reason: 'Cannot make purchases while account is suspended',
    }
  }

  return { allowed: true }
}
