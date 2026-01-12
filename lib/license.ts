import crypto from 'crypto'
import { AuditAction, LicenseType, LicenseStatus, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { createAuditLog } from '@/lib/audit-logger'

// Team license constants
export const TEAM_LICENSE_MAX_SEATS = 5
export const TEAM_LICENSE_MIN_SEATS = 2

// Download abuse detection constants
export const DOWNLOAD_ABUSE_THRESHOLD = 10 // downloads in window
export const DOWNLOAD_ABUSE_WINDOW_HOURS = 24
export const DOWNLOAD_DEVICE_LIMIT = 3 // unique devices per license

/**
 * Generate a unique license key
 */
export function generateLicenseKey(prefix: string = 'LIC'): string {
  const random = crypto.randomBytes(16).toString('hex').toUpperCase()
  const parts = random.match(/.{1,4}/g) || []
  return `${prefix}-${parts.slice(0, 4).join('-')}`
}

/**
 * Log audit event for license actions
 */
export async function logLicenseAudit(options: {
  userId: string | null
  action: AuditAction
  licenseId: string
  ipHash?: string
  userAgent?: string | null
  details?: Record<string, unknown>
}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: options.userId ?? undefined,
        action: options.action,
        resource: 'License',
        resourceId: options.licenseId,
        ipHash: options.ipHash,
        userAgent: options.userAgent ?? undefined,
        details: options.details
          ? JSON.parse(JSON.stringify(options.details))
          : undefined,
      },
    })
  } catch (error) {
    console.error('Failed to write license audit log', error)
  }
}

/**
 * Check if a license can accommodate more seats
 */
export async function canAssignSeat(licenseId: string): Promise<{
  canAssign: boolean
  reason?: string
  currentSeats: number
  maxSeats: number
}> {
  const license = await prisma.license.findUnique({
    where: { id: licenseId },
    include: {
      seatAssignments: {
        where: { active: true },
      },
    },
  })

  if (!license) {
    return {
      canAssign: false,
      reason: 'License not found',
      currentSeats: 0,
      maxSeats: 0,
    }
  }

  if (license.status !== 'ACTIVE') {
    return {
      canAssign: false,
      reason: `License is ${license.status.toLowerCase()}`,
      currentSeats: license.seatAssignments.length,
      maxSeats: license.maxUsers,
    }
  }

  if (license.licenseType !== 'TEAM') {
    return {
      canAssign: false,
      reason: 'Only team licenses support seat assignments',
      currentSeats: license.seatAssignments.length,
      maxSeats: license.maxUsers,
    }
  }

  const activeSeats = license.seatAssignments.length

  if (activeSeats >= license.maxUsers) {
    return {
      canAssign: false,
      reason: `Maximum seats (${license.maxUsers}) reached`,
      currentSeats: activeSeats,
      maxSeats: license.maxUsers,
    }
  }

  if (license.maxUsers > TEAM_LICENSE_MAX_SEATS) {
    return {
      canAssign: false,
      reason: `Team licenses cannot exceed ${TEAM_LICENSE_MAX_SEATS} seats`,
      currentSeats: activeSeats,
      maxSeats: license.maxUsers,
    }
  }

  return {
    canAssign: true,
    currentSeats: activeSeats,
    maxSeats: license.maxUsers,
  }
}

/**
 * Assign a seat to a user on a team license
 */
export async function assignLicenseSeat(options: {
  licenseId: string
  assignedUserId: string
  assignedUserEmail: string
  assignedBy: string
  ipHash?: string
  userAgent?: string
}): Promise<{
  success: boolean
  error?: string
  seatAssignment?: any
}> {
  const canAssign = await canAssignSeat(options.licenseId)

  if (!canAssign.canAssign) {
    return {
      success: false,
      error: canAssign.reason,
    }
  }

  try {
    // Check if user is already assigned
    const existing = await prisma.licenseSeatAssignment.findUnique({
      where: {
        licenseId_assignedUserEmail: {
          licenseId: options.licenseId,
          assignedUserEmail: options.assignedUserEmail,
        },
      },
    })

    if (existing && existing.active) {
      return {
        success: false,
        error: 'User is already assigned to this license',
      }
    }

    // Create or reactivate seat assignment
    const seatAssignment = existing
      ? await prisma.licenseSeatAssignment.update({
          where: { id: existing.id },
          data: {
            active: true,
            assignedUserId: options.assignedUserId,
            revokedAt: null,
            revokedBy: null,
            updatedAt: new Date(),
          },
        })
      : await prisma.licenseSeatAssignment.create({
          data: {
            licenseId: options.licenseId,
            assignedUserId: options.assignedUserId,
            assignedUserEmail: options.assignedUserEmail,
            assignedBy: options.assignedBy,
            active: true,
          },
        })

    // Update license current user count
    const activeSeatsCount = await prisma.licenseSeatAssignment.count({
      where: {
        licenseId: options.licenseId,
        active: true,
      },
    })

    await prisma.license.update({
      where: { id: options.licenseId },
      data: { currentUsers: activeSeatsCount },
    })

    // Log audit event
    await logLicenseAudit({
      userId: options.assignedBy,
      action: 'LICENSE_SEAT_ASSIGNED',
      licenseId: options.licenseId,
      ipHash: options.ipHash,
      userAgent: options.userAgent,
      details: {
        assignedUserId: options.assignedUserId,
        assignedUserEmail: options.assignedUserEmail,
        seatAssignmentId: seatAssignment.id,
      },
    })

    return {
      success: true,
      seatAssignment,
    }
  } catch (error: any) {
    console.error('Failed to assign license seat:', error)
    return {
      success: false,
      error: error.message || 'Failed to assign seat',
    }
  }
}

/**
 * Revoke a seat assignment
 */
export async function revokeLicenseSeat(options: {
  seatAssignmentId: string
  revokedBy: string
  ipHash?: string
  userAgent?: string
}): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const seatAssignment = await prisma.licenseSeatAssignment.findUnique({
      where: { id: options.seatAssignmentId },
    })

    if (!seatAssignment) {
      return {
        success: false,
        error: 'Seat assignment not found',
      }
    }

    if (!seatAssignment.active) {
      return {
        success: false,
        error: 'Seat assignment is already revoked',
      }
    }

    // Revoke the seat
    await prisma.licenseSeatAssignment.update({
      where: { id: options.seatAssignmentId },
      data: {
        active: false,
        revokedAt: new Date(),
        revokedBy: options.revokedBy,
      },
    })

    // Update license current user count
    const activeSeatsCount = await prisma.licenseSeatAssignment.count({
      where: {
        licenseId: seatAssignment.licenseId,
        active: true,
      },
    })

    await prisma.license.update({
      where: { id: seatAssignment.licenseId },
      data: { currentUsers: activeSeatsCount },
    })

    // Log audit event
    await logLicenseAudit({
      userId: options.revokedBy,
      action: 'LICENSE_SEAT_REVOKED',
      licenseId: seatAssignment.licenseId,
      ipHash: options.ipHash,
      userAgent: options.userAgent,
      details: {
        seatAssignmentId: options.seatAssignmentId,
        assignedUserId: seatAssignment.assignedUserId,
        assignedUserEmail: seatAssignment.assignedUserEmail,
      },
    })

    return {
      success: true,
    }
  } catch (error: any) {
    console.error('Failed to revoke license seat:', error)
    return {
      success: false,
      error: error.message || 'Failed to revoke seat',
    }
  }
}

/**
 * Check if user has valid access to a license
 */
export async function validateLicenseAccess(options: {
  licenseId: string
  userId: string
  userEmail: string
}): Promise<{
  hasAccess: boolean
  reason?: string
  isOwner: boolean
  hasSeat: boolean
}> {
  const license = await prisma.license.findUnique({
    where: { id: options.licenseId },
    include: {
      seatAssignments: {
        where: { active: true },
      },
    },
  })

  if (!license) {
    return {
      hasAccess: false,
      reason: 'License not found',
      isOwner: false,
      hasSeat: false,
    }
  }

  if (license.status !== 'ACTIVE') {
    return {
      hasAccess: false,
      reason: `License is ${license.status.toLowerCase()}`,
      isOwner: license.userId === options.userId,
      hasSeat: false,
    }
  }

  // Check if user is the license owner
  if (license.userId === options.userId) {
    return {
      hasAccess: true,
      isOwner: true,
      hasSeat: false,
    }
  }

  // For team licenses, check seat assignments
  if (license.licenseType === 'TEAM') {
    const hasSeat = license.seatAssignments.some(
      seat =>
        seat.assignedUserEmail.toLowerCase() === options.userEmail.toLowerCase()
    )

    return {
      hasAccess: hasSeat,
      reason: hasSeat ? undefined : 'No active seat assignment found',
      isOwner: false,
      hasSeat,
    }
  }

  // Personal and commercial licenses - only owner has access
  return {
    hasAccess: false,
    reason: 'License is not shared',
    isOwner: false,
    hasSeat: false,
  }
}

/**
 * Detect download abuse for a license
 */
export async function detectDownloadAbuse(
  licenseId: string
): Promise<{
  isAbuse: boolean
  reason?: string
  details?: Record<string, any>
}> {
  const cutoffTime = new Date(
    Date.now() - DOWNLOAD_ABUSE_WINDOW_HOURS * 60 * 60 * 1000
  )

  // Get recent downloads for this license
  const recentDownloads = await prisma.download.findMany({
    where: {
      licenseId,
      downloadedAt: {
        gte: cutoffTime,
      },
    },
    select: {
      id: true,
      deviceFingerprint: true,
      ipHash: true,
      downloadedAt: true,
      successful: true,
    },
  })

  const downloadCount = recentDownloads.length
  const uniqueDevices = new Set(
    recentDownloads
      .map(d => d.deviceFingerprint)
      .filter((fp): fp is string => Boolean(fp))
  ).size
  const uniqueIps = new Set(recentDownloads.map(d => d.ipHash)).size

  // Check download count abuse
  if (downloadCount > DOWNLOAD_ABUSE_THRESHOLD) {
    return {
      isAbuse: true,
      reason: `Excessive downloads: ${downloadCount} in ${DOWNLOAD_ABUSE_WINDOW_HOURS}h`,
      details: {
        downloadCount,
        uniqueDevices,
        uniqueIps,
        threshold: DOWNLOAD_ABUSE_THRESHOLD,
        windowHours: DOWNLOAD_ABUSE_WINDOW_HOURS,
      },
    }
  }

  // Check device count abuse (for personal licenses)
  const license = await prisma.license.findUnique({
    where: { id: licenseId },
    select: { licenseType: true },
  })

  if (
    license?.licenseType === 'PERSONAL' &&
    uniqueDevices > DOWNLOAD_DEVICE_LIMIT
  ) {
    return {
      isAbuse: true,
      reason: `Too many devices: ${uniqueDevices} (limit: ${DOWNLOAD_DEVICE_LIMIT})`,
      details: {
        downloadCount,
        uniqueDevices,
        uniqueIps,
        deviceLimit: DOWNLOAD_DEVICE_LIMIT,
      },
    }
  }

  return {
    isAbuse: false,
    details: {
      downloadCount,
      uniqueDevices,
      uniqueIps,
    },
  }
}

/**
 * Flag a license for abuse
 */
export async function flagLicenseAbuse(options: {
  licenseId: string
  reason: string
  flaggedBy: string
  ipHash?: string
  userAgent?: string
  details?: Record<string, any>
}): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const now = new Date()
    const result = await prisma.$transaction(async (tx) => {
      const license = await tx.license.update({
        where: { id: options.licenseId },
        data: {
          abuseFlagged: true,
          abuseFlaggedAt: now,
          abuseFlaggedBy: options.flaggedBy,
          abuseReason: options.reason,
          status: 'SUSPENDED',
        },
        select: {
          id: true,
          userId: true,
        },
      })

      const user = await tx.user.findUnique({
        where: { id: license.userId },
        select: { accountStatus: true },
      })

      let accountLocked = false
      if (user && user.accountStatus !== 'LOCKED' && user.accountStatus !== 'BANNED') {
        await tx.user.update({
          where: { id: license.userId },
          data: {
            accountStatus: 'LOCKED',
            accountLockedAt: now,
            accountLockedReason: `License abuse detected; manual review required. Reason: ${options.reason}`,
          },
        })
        accountLocked = true
      }

      return { license, accountLocked }
    })

    // Log audit event
    await logLicenseAudit({
      userId: options.flaggedBy,
      action: 'LICENSE_ABUSE_FLAGGED',
      licenseId: options.licenseId,
      ipHash: options.ipHash,
      userAgent: options.userAgent,
      details: {
        reason: options.reason,
        ...options.details,
      },
    })

    if (result.accountLocked) {
      await createAuditLog({
        action: 'ACCOUNT_LOCKED',
        resource: 'User',
        resourceId: result.license.userId,
        details: {
          event: 'LICENSE_ABUSE_LOCK',
          reason: options.reason,
          licenseId: result.license.id,
          flaggedBy: options.flaggedBy,
        },
        ipHash: options.ipHash,
        userAgent: options.userAgent,
      })
    }

    return {
      success: true,
    }
  } catch (error: any) {
    console.error('Failed to flag license abuse:', error)
    return {
      success: false,
      error: error.message || 'Failed to flag abuse',
    }
  }
}

/**
 * Clear abuse flag from a license (admin override)
 */
export async function clearLicenseAbuseFlag(options: {
  licenseId: string
  clearedBy: string
  ipHash?: string
  userAgent?: string
}): Promise<{
  success: boolean
  error?: string
}> {
  try {
    await prisma.license.update({
      where: { id: options.licenseId },
      data: {
        abuseFlagged: false,
        abuseFlaggedAt: null,
        abuseFlaggedBy: null,
        abuseReason: null,
        status: 'ACTIVE',
      },
    })

    // Log audit event
    await logLicenseAudit({
      userId: options.clearedBy,
      action: 'LICENSE_ABUSE_CLEARED',
      licenseId: options.licenseId,
      ipHash: options.ipHash,
      userAgent: options.userAgent,
      details: {
        clearedBy: options.clearedBy,
      },
    })

    return {
      success: true,
    }
  } catch (error: any) {
    console.error('Failed to clear license abuse flag:', error)
    return {
      success: false,
      error: error.message || 'Failed to clear abuse flag',
    }
  }
}

/**
 * Suspend a license (admin action)
 */
export async function suspendLicense(options: {
  licenseId: string
  reason: string
  suspendedBy: string
  ipHash?: string
  userAgent?: string
}): Promise<{
  success: boolean
  error?: string
}> {
  try {
    await prisma.license.update({
      where: { id: options.licenseId },
      data: {
        status: 'SUSPENDED',
        revokedReason: options.reason,
      },
    })

    // Log audit event
    await logLicenseAudit({
      userId: options.suspendedBy,
      action: 'LICENSE_SUSPENDED',
      licenseId: options.licenseId,
      ipHash: options.ipHash,
      userAgent: options.userAgent,
      details: {
        reason: options.reason,
      },
    })

    return {
      success: true,
    }
  } catch (error: any) {
    console.error('Failed to suspend license:', error)
    return {
      success: false,
      error: error.message || 'Failed to suspend license',
    }
  }
}

/**
 * Reactivate a suspended license (admin action)
 */
export async function reactivateLicense(options: {
  licenseId: string
  reactivatedBy: string
  ipHash?: string
  userAgent?: string
}): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const license = await prisma.license.findUnique({
      where: { id: options.licenseId },
    })

    if (license?.status !== 'SUSPENDED') {
      return {
        success: false,
        error: 'License is not suspended',
      }
    }

    await prisma.license.update({
      where: { id: options.licenseId },
      data: {
        status: 'ACTIVE',
        revokedReason: null,
        abuseFlagged: false,
        abuseFlaggedAt: null,
        abuseFlaggedBy: null,
        abuseReason: null,
      },
    })

    // Log audit event
    await logLicenseAudit({
      userId: options.reactivatedBy,
      action: 'LICENSE_REACTIVATED',
      licenseId: options.licenseId,
      ipHash: options.ipHash,
      userAgent: options.userAgent,
      details: {
        reactivatedBy: options.reactivatedBy,
      },
    })

    return {
      success: true,
    }
  } catch (error: any) {
    console.error('Failed to reactivate license:', error)
    return {
      success: false,
      error: error.message || 'Failed to reactivate license',
    }
  }
}
