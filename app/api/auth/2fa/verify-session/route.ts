import { NextRequest, NextResponse } from 'next/server'
import { authenticator } from 'otplib'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { checkRateLimit, getRateLimitHeaders, getRateLimitKey } from '@/lib/rate-limit'
import { createAuditLog } from '@/lib/audit-logger'
import { AuditAction } from '@prisma/client'
import {
  ADMIN_DEVICE_ID_COOKIE,
  ADMIN_TRUST_DEVICE_COOKIE,
  ADMIN_STEPUP_COOKIE,
  ADMIN_LAST_ACTIVE_COOKIE,
  ADMIN_TRUST_DEVICE_TTL_SECONDS,
  ADMIN_STEPUP_TTL_SECONDS,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  createSignedToken,
  getRequestCountry,
  getRequestIp,
  hashValue,
} from '@/lib/admin-security'

const ADMIN_ROLES = new Set(['ADMIN', 'OWNER', 'MODERATOR', 'EDITOR'])

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

    if (!ADMIN_ROLES.has(session.user.role)) {
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
    const rememberDevice = body?.rememberDevice === true

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

    if (!user || !ADMIN_ROLES.has(user.role)) {
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

    const now = new Date()
    const ip = getRequestIp(request.headers)
    const ipHash = ip ? await hashValue(ip) : 'unknown'
    const userAgent = request.headers.get('user-agent') || undefined
    const deviceCookie = request.cookies.get(ADMIN_DEVICE_ID_COOKIE)
    const deviceId = deviceCookie?.value || globalThis.crypto.randomUUID()
    const trustedUntil = rememberDevice
      ? new Date(now.getTime() + ADMIN_TRUST_DEVICE_TTL_SECONDS * 1000)
      : new Date(now.getTime() + ADMIN_SESSION_MAX_AGE_SECONDS * 1000)

    await prisma.deviceSession.upsert({
      where: {
        userId_deviceFingerprint: {
          userId: user.id,
          deviceFingerprint: deviceId,
        },
      },
      update: {
        ipHash,
        userAgent,
        blocked: false,
        blockedReason: null,
        lastSeen: now,
        trustedUntil,
        lastTwoFactorAt: now,
      },
      create: {
        userId: user.id,
        deviceFingerprint: deviceId,
        ipHash,
        userAgent,
        blocked: false,
        trustedUntil,
        lastTwoFactorAt: now,
      },
    })

    const nowSeconds = Math.floor(now.getTime() / 1000)
    const trustPayload = {
      u: user.id,
      d: deviceId,
      iat: nowSeconds,
      exp: nowSeconds + (rememberDevice ? ADMIN_TRUST_DEVICE_TTL_SECONDS : ADMIN_SESSION_MAX_AGE_SECONDS),
      ip: ip ? ipHash : undefined,
      c: getRequestCountry(request.headers) || undefined,
      ua: userAgent ? await hashValue(userAgent) : undefined,
    }
    const stepupPayload = {
      u: user.id,
      iat: nowSeconds,
      exp: nowSeconds + ADMIN_STEPUP_TTL_SECONDS,
    }

    const trustToken = await createSignedToken(trustPayload)
    const stepupToken = await createSignedToken(stepupPayload)
    const isProd = process.env.NODE_ENV === 'production'

    const response = NextResponse.json({
      success: true,
      backupCodeUsed: isBackupCode,
    })

    response.cookies.set(ADMIN_DEVICE_ID_COOKIE, deviceId, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: ADMIN_TRUST_DEVICE_TTL_SECONDS,
    })
    response.cookies.set(ADMIN_TRUST_DEVICE_COOKIE, trustToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: rememberDevice ? ADMIN_TRUST_DEVICE_TTL_SECONDS : ADMIN_SESSION_MAX_AGE_SECONDS,
    })
    response.cookies.set(ADMIN_STEPUP_COOKIE, stepupToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: ADMIN_STEPUP_TTL_SECONDS,
    })
    response.cookies.set(ADMIN_LAST_ACTIVE_COOKIE, nowSeconds.toString(), {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: ADMIN_TRUST_DEVICE_TTL_SECONDS,
    })

    await createAuditLog({
      userId: user.id,
      action: AuditAction.USER_LOGIN,
      resource: '2FA',
      resourceId: user.id,
      details: {
        success: true,
        rememberDevice,
        backupCodeUsed: isBackupCode,
      },
    })

    return response
  } catch (error: any) {
    console.error('Error verifying 2FA session:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to verify 2FA' },
      { status: 500 }
    )
  }
}
