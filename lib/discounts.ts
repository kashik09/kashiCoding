import { prisma } from '@/lib/prisma'
import type { DiscountType, VerificationStatus } from '@prisma/client'

export interface DiscountEligibility {
  eligible: boolean
  discountType: DiscountType
  discountPercent: number
  expiresAt?: Date | null
  reason?: string
}

/**
 * Check if user is eligible for any discounts
 * Returns discount eligibility with percentage
 */
export async function getUserDiscountEligibility(
  userId: string
): Promise<DiscountEligibility> {
  try {
    // Check for active student verification
    const verification = await prisma.studentVerification.findUnique({
      where: { userId },
    })

    if (!verification) {
      return {
        eligible: false,
        discountType: 'NONE',
        discountPercent: 0,
      }
    }

    // Check if approved and not expired
    if (verification.status === 'APPROVED') {
      if (verification.expiresAt && verification.expiresAt > new Date()) {
        // Active student discount
        const discountPercent = verification.discountType === 'YOUTH_13_18' ? 50 : 50
        return {
          eligible: true,
          discountType: verification.discountType,
          discountPercent,
          expiresAt: verification.expiresAt,
        }
      } else if (verification.expiresAt && verification.expiresAt <= new Date()) {
        // Expired - update status
        await prisma.studentVerification.update({
          where: { id: verification.id },
          data: { status: 'EXPIRED' },
        })

        return {
          eligible: false,
          discountType: 'NONE',
          discountPercent: 0,
          reason: 'Student verification expired',
        }
      } else if (!verification.expiresAt) {
        // Approved but no expiry set (shouldn't happen, but handle gracefully)
        return {
          eligible: true,
          discountType: verification.discountType,
          discountPercent: 50,
          expiresAt: null,
        }
      }
    }

    // Pending, rejected, or expired
    return {
      eligible: false,
      discountType: 'NONE',
      discountPercent: 0,
      reason:
        verification.status === 'PENDING'
          ? 'Student verification pending approval'
          : verification.status === 'REJECTED'
          ? 'Student verification rejected'
          : 'Student verification expired',
    }
  } catch (error) {
    console.error('Error checking discount eligibility:', error)
    return {
      eligible: false,
      discountType: 'NONE',
      discountPercent: 0,
      reason: 'Error checking eligibility',
    }
  }
}

/**
 * Calculate discounted price
 */
export function calculateDiscountedPrice(
  originalPrice: number,
  discountPercent: number
): number {
  if (discountPercent <= 0 || discountPercent > 100) {
    return originalPrice
  }

  const discount = (originalPrice * discountPercent) / 100
  return Math.max(0, originalPrice - discount)
}

/**
 * Get discount display info
 */
export function getDiscountDisplayInfo(discountType: DiscountType): {
  label: string
  badge: string
  description: string
} {
  switch (discountType) {
    case 'STUDENT':
      return {
        label: 'Student Discount',
        badge: '50% OFF',
        description: 'Verified student discount (ages 18+)',
      }
    case 'YOUTH_13_18':
      return {
        label: 'Youth Discount',
        badge: '50% OFF',
        description: 'Verified youth discount (ages 13-18)',
      }
    case 'PROMOTIONAL':
      return {
        label: 'Promotional Discount',
        badge: 'DISCOUNT',
        description: 'Limited-time promotional offer',
      }
    default:
      return {
        label: '',
        badge: '',
        description: '',
      }
  }
}

/**
 * Check if user can apply for student verification (cooldown check)
 */
export async function canApplyForVerification(userId: string): Promise<{
  canApply: boolean
  reason?: string
  nextAvailableAt?: Date
}> {
  const existing = await prisma.studentVerification.findUnique({
    where: { userId },
  })

  if (!existing) {
    return { canApply: true }
  }

  // If approved and active, cannot reapply
  if (existing.status === 'APPROVED' && existing.expiresAt && existing.expiresAt > new Date()) {
    return {
      canApply: false,
      reason: 'You already have an active student verification',
    }
  }

  // If rejected, enforce 24-hour cooldown
  if (existing.status === 'REJECTED' && existing.lastApplicationAt) {
    const cooldownHours = 24
    const nextAvailable = new Date(existing.lastApplicationAt.getTime() + cooldownHours * 60 * 60 * 1000)

    if (new Date() < nextAvailable) {
      return {
        canApply: false,
        reason: 'Please wait before reapplying',
        nextAvailableAt: nextAvailable,
      }
    }
  }

  // If pending, cannot submit another
  if (existing.status === 'PENDING') {
    return {
      canApply: false,
      reason: 'You have a pending verification request',
    }
  }

  return { canApply: true }
}
