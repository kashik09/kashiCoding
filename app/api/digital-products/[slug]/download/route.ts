import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { AuditAction, LicenseStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import {
  DOWNLOAD_TOKEN_TTL_SECONDS,
  DOWNLOAD_LIMIT,
  DOWNLOAD_WINDOW_DAYS,
  hashIp,
  logDownloadEvent,
  createDownloadToken,
} from '@/lib/downloads'
import { detectDownloadAbuse, flagLicenseAbuse } from '@/lib/license'
import { canUserDownload } from '@/lib/suspension-middleware'
import { checkAndSuspendIfAbused } from '@/lib/suspension'
import { getEmailConfig, getEmailTemplate, sendEmail } from '@/lib/email'
import { checkRateLimit, getRateLimitHeaders, getRateLimitKey } from '@/lib/rate-limit'

function getClientIp(req: NextRequest): string | null {
  const headerList = headers()
  const forwardedFor = headerList.get('x-forwarded-for')
  if (forwardedFor) {
    const ips = forwardedFor.split(',').map(ip => ip.trim())
    if (ips.length > 0 && ips[0]) {
      return ips[0]
    }
  }

  const realIp = headerList.get('x-real-ip')
  if (realIp) return realIp

  return null
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const session = await getServerSession()

  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const userId = session.user.id
  const ip = getClientIp(request)
  const ipHash = hashIp(ip)
  const userAgent = headers().get('user-agent')

  const rateLimit = checkRateLimit(
    getRateLimitKey(request, 'downloads:initiate'),
    5,
    10 * 60 * 1000
  )
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many download attempts' },
      { status: 429, headers: getRateLimitHeaders(rateLimit) }
    )
  }

  // Record attempted download early for security visibility
  await logDownloadEvent({
    userId,
    action: AuditAction.DOWNLOAD_ATTEMPTED,
    resourceId: params.slug,
    ipHash,
    userAgent,
  })

  try {
    const product = await prisma.digitalProduct.findUnique({
      where: { slug: params.slug },
    })

    if (!product || !product.published) {
      await logDownloadEvent({
        userId,
        action: AuditAction.DOWNLOAD_FAILED,
        resourceId: params.slug,
        ipHash,
        userAgent,
        details: { reason: 'PRODUCT_NOT_FOUND_OR_UNPUBLISHED' },
      })

      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    // Ensure user has an active license for this product
    const license = await prisma.license.findFirst({
      where: {
        userId,
        productId: product.id,
        status: LicenseStatus.ACTIVE,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
    })

    if (!license) {
      await logDownloadEvent({
        userId,
        action: AuditAction.DOWNLOAD_FAILED,
        resourceId: product.id,
        ipHash,
        userAgent,
        details: { reason: 'NO_ACTIVE_LICENSE' },
      })

      return NextResponse.json(
        { success: false, error: 'No active license for this product' },
        { status: 403 }
      )
    }

    // Check suspension gates
    const downloadPermission = await canUserDownload(userId, license.id)
    if (!downloadPermission.allowed) {
      await logDownloadEvent({
        userId,
        action: AuditAction.DOWNLOAD_FAILED,
        resourceId: product.id,
        ipHash,
        userAgent,
        details: { reason: 'SUSPENDED_OR_RESTRICTED', message: downloadPermission.reason },
      })

      return NextResponse.json(
        { success: false, error: downloadPermission.reason || 'Cannot download at this time' },
        { status: 403 }
      )
    }

    if (license.abuseDetected || license.status !== LicenseStatus.ACTIVE) {
      await logDownloadEvent({
        userId,
        action: AuditAction.DOWNLOAD_FAILED,
        resourceId: product.id,
        ipHash,
        userAgent,
        details: { reason: 'LICENSE_RESTRICTED', licenseStatus: license.status },
      })

      return NextResponse.json(
        { success: false, error: 'License is not in good standing' },
        { status: 403 }
      )
    }

    const now = new Date()
    const windowStart = new Date(
      now.getTime() - DOWNLOAD_WINDOW_DAYS * 24 * 60 * 60 * 1000
    )
    const attemptCount = await prisma.download.count({
      where: {
        userId,
        productId: product.id,
        licenseId: license.id,
        downloadedAt: {
          gte: windowStart,
        },
      },
    })

    if (attemptCount >= DOWNLOAD_LIMIT) {
      await logDownloadEvent({
        userId,
        action: AuditAction.DOWNLOAD_FAILED,
        resourceId: product.id,
        ipHash,
        userAgent,
        details: {
          reason: 'DOWNLOAD_LIMIT_REACHED',
          limit: DOWNLOAD_LIMIT,
          windowDays: DOWNLOAD_WINDOW_DAYS,
        },
      })

      return NextResponse.json(
        {
          success: false,
          error: 'Download limit reached for this period',
          code: 'DOWNLOAD_LIMIT_REACHED',
        },
        { status: 429 }
      )
    }

    // Check for download abuse before allowing download
    const abuseCheck = await detectDownloadAbuse(license.id)
    if (abuseCheck.isAbuse) {
      // Flag the license for abuse
      await flagLicenseAbuse({
        licenseId: license.id,
        reason: abuseCheck.reason || 'Download abuse detected',
        flaggedBy: 'system',
        ipHash: ipHash ?? undefined,
        userAgent: userAgent ?? undefined,
        details: abuseCheck.details,
      })

      // Log audit event
      await logDownloadEvent({
        userId,
        action: AuditAction.DOWNLOAD_ABUSE_DETECTED,
        resourceId: product.id,
        ipHash,
        userAgent,
        details: abuseCheck.details,
      })

      // Get user details
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, name: true },
      })

      // Send abuse detection email
      if (user) {
        try {
          const emailTemplate = getEmailTemplate('license-abuse-detected', {
            productName: product.name,
            licenseKey: license.licenseKey,
            abuseReason: abuseCheck.reason,
          })

          const emailConfig = await getEmailConfig()
          await sendEmail(emailConfig, {
            to: user.email,
            subject: emailTemplate.subject,
            html: emailTemplate.html,
          })
        } catch (err) {
          console.error('Failed to send abuse detection email:', err)
        }
      }

      return NextResponse.json(
        {
          success: false,
          error: 'License has been suspended due to suspected abuse. Please contact support.',
        },
        { status: 403 }
      )
    }

    // Check for new abuse patterns and auto-suspend if needed
    const suspensionCheck = await checkAndSuspendIfAbused(userId, license.id)
    if (suspensionCheck.suspended) {
      await logDownloadEvent({
        userId,
        action: AuditAction.DOWNLOAD_FAILED,
        resourceId: product.id,
        ipHash,
        userAgent,
        details: { reason: 'AUTO_SUSPENDED', message: suspensionCheck.reason },
      })

      return NextResponse.json(
        {
          success: false,
          error: 'Your account has been suspended due to suspicious activity. Please contact support.',
        },
        { status: 403 }
      )
    }

    // Optional device fingerprint from client
    let deviceFingerprint: string | undefined
    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
      try {
        const body = await request.json()
        if (body && typeof body.deviceFingerprint === 'string') {
          deviceFingerprint = body.deviceFingerprint
        }
      } catch {
        // Ignore body parse errors - do not block download
      }
    }

    const download = await prisma.download.create({
      data: {
        userId,
        productId: product.id,
        licenseId: license.id,
        successful: false,
        ipHash,
        deviceFingerprint,
        userAgent: userAgent ?? undefined,
      },
    })

    const nowEpoch = Math.floor(Date.now() / 1000)
    const token = createDownloadToken({
      d: download.id,
      u: userId,
      p: product.id,
      l: license.id,
      exp: nowEpoch + DOWNLOAD_TOKEN_TTL_SECONDS,
    })

    return NextResponse.json({
      success: true,
      data: {
        downloadToken: token,
        expiresIn: DOWNLOAD_TOKEN_TTL_SECONDS,
      },
    })
  } catch (error) {
    console.error('Error handling digital product download:', error)

    await logDownloadEvent({
      userId,
      action: AuditAction.DOWNLOAD_FAILED,
      resourceId: params.slug,
      ipHash,
      userAgent,
      details: { reason: 'INTERNAL_ERROR' },
    })

    return NextResponse.json(
      { success: false, error: 'Failed to initiate download' },
      { status: 500 }
    )
  }
}
