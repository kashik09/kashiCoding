import { prisma } from '@/lib/prisma'
import type { AccountStatus } from '@prisma/client'

/**
 * Suspend user account
 */
export async function suspendUser(
  userId: string,
  reason: string,
  suspendedBy: string
): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      accountStatus: 'SUSPENDED',
      suspendedAt: new Date(),
      suspendedReason: reason,
      suspendedBy,
    },
  })

  // Revoke all active licenses
  await prisma.license.updateMany({
    where: {
      userId,
      status: 'ACTIVE',
    },
    data: {
      status: 'SUSPENDED',
      revokedReason: `Account suspended: ${reason}`,
      revokedAt: new Date(),
    },
  })

  // Log audit event
  await prisma.auditLog.create({
    data: {
      userId,
      action: 'ACCOUNT_SUSPENDED',
      resource: 'User',
      resourceId: userId,
      details: { reason, suspendedBy },
    },
  })
}

/**
 * Unsuspend user account
 */
export async function unsuspendUser(userId: string, unsuspendedBy: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      accountStatus: 'ACTIVE',
      suspendedAt: null,
      suspendedReason: null,
      suspendedBy: null,
    },
  })

  // Reactivate licenses (admin must review individually if needed)
  await prisma.license.updateMany({
    where: {
      userId,
      status: 'SUSPENDED',
    },
    data: {
      status: 'ACTIVE',
      revokedAt: null,
      revokedReason: null,
    },
  })

  // Log audit event
  await prisma.auditLog.create({
    data: {
      userId,
      action: 'ACCOUNT_UNSUSPENDED',
      resource: 'User',
      resourceId: userId,
      details: { unsuspendedBy },
    },
  })
}

/**
 * Check if user is suspended
 */
export async function isUserSuspended(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { accountStatus: true },
  })

  return user?.accountStatus === 'SUSPENDED'
}

/**
 * Detect suspicious download behavior
 * Returns suspicion score (0-100)
 */
export async function detectSuspiciousDownloads(
  userId: string,
  licenseId: string
): Promise<{ suspicious: boolean; score: number; reasons: string[] }> {
  const reasons: string[] = []
  let score = 0

  // Get downloads in last 24 hours
  const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const recentDownloads = await prisma.download.findMany({
    where: {
      licenseId,
      downloadedAt: { gte: last24Hours },
    },
    select: {
      ipHash: true,
      deviceFingerprint: true,
      successful: true,
    },
  })

  if (recentDownloads.length === 0) {
    return { suspicious: false, score: 0, reasons: [] }
  }

  // Check 1: Excessive download count
  const downloadCount = recentDownloads.length
  if (downloadCount > 10) {
    score += 30
    reasons.push(`Excessive downloads: ${downloadCount} in 24h`)
  } else if (downloadCount > 5) {
    score += 15
    reasons.push(`High download frequency: ${downloadCount} in 24h`)
  }

  // Check 2: Multiple unique IPs
  const uniqueIPs = new Set(recentDownloads.map((d) => d.ipHash))
  if (uniqueIPs.size > 5) {
    score += 40
    reasons.push(`Multiple IPs: ${uniqueIPs.size} different locations`)
  } else if (uniqueIPs.size > 3) {
    score += 20
    reasons.push(`Varied IPs: ${uniqueIPs.size} locations`)
  }

  // Check 3: Multiple unique devices (for personal licenses)
  const license = await prisma.license.findUnique({
    where: { id: licenseId },
    select: { licenseType: true },
  })

  if (license?.licenseType === 'PERSONAL') {
    const uniqueDevices = new Set(
      recentDownloads.map((d) => d.deviceFingerprint).filter(Boolean)
    )
    if (uniqueDevices.size > 3) {
      score += 30
      reasons.push(`Multiple devices: ${uniqueDevices.size} (Personal license allows 1)`)
    }
  }

  // Check 4: Failed download patterns (possible scraping)
  const failedDownloads = recentDownloads.filter((d) => !d.successful).length
  const failureRate = failedDownloads / downloadCount
  if (failureRate > 0.5) {
    score += 20
    reasons.push(`High failure rate: ${Math.round(failureRate * 100)}%`)
  }

  return {
    suspicious: score >= 50, // Threshold for suspicion
    score: Math.min(score, 100),
    reasons,
  }
}

/**
 * Auto-suspend if abuse detected
 */
export async function checkAndSuspendIfAbused(
  userId: string,
  licenseId: string
): Promise<{ suspended: boolean; reason?: string }> {
  const detection = await detectSuspiciousDownloads(userId, licenseId)

  if (detection.suspicious && detection.score >= 70) {
    // High confidence abuse
    const reason = `Automated suspension: ${detection.reasons.join(', ')}`

    await suspendUser(userId, reason, 'SYSTEM')

    // Flag license for abuse
    await prisma.license.update({
      where: { id: licenseId },
      data: {
        abuseFlagged: true,
        abuseReason: reason,
        abuseFlaggedAt: new Date(),
        abuseFlaggedBy: 'SYSTEM',
        status: 'SUSPENDED',
        suspicionScore: detection.score,
        lastAbuseCheckAt: new Date(),
      },
    })

    // Log audit event
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'LICENSE_ABUSE_DETECTED',
        resource: 'License',
        resourceId: licenseId,
        details: {
          suspicionScore: detection.score,
          reasons: detection.reasons,
          autoSuspended: true,
        },
      },
    })

    return { suspended: true, reason }
  } else if (detection.suspicious) {
    // Medium confidence - flag but don't auto-suspend
    await prisma.license.update({
      where: { id: licenseId },
      data: {
        suspicionScore: detection.score,
        lastAbuseCheckAt: new Date(),
      },
    })

    // Log for admin review
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'RESALE_SUSPECTED',
        resource: 'License',
        resourceId: licenseId,
        details: {
          suspicionScore: detection.score,
          reasons: detection.reasons,
          requiresReview: true,
        },
      },
    })
  }

  return { suspended: false }
}
