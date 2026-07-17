import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { ADMIN_DEVICE_ID_COOKIE } from '@/lib/admin-security'

export const dynamic = 'force-dynamic'

const ADMIN_ROLES = new Set(['ADMIN', 'OWNER', 'MODERATOR', 'EDITOR'])

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id || !ADMIN_ROLES.has(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    const deviceId = request.cookies.get(ADMIN_DEVICE_ID_COOKIE)?.value || null

    const devices = await prisma.deviceSession.findMany({
      where: { userId: session.user.id },
      orderBy: { lastSeen: 'desc' },
      select: {
        id: true,
        deviceFingerprint: true,
        userAgent: true,
        ipHash: true,
        blocked: true,
        blockedReason: true,
        trustedUntil: true,
        lastTwoFactorAt: true,
        firstSeen: true,
        lastSeen: true,
      },
    })

    const data = devices.map(device => ({
      ...device,
      isCurrent: deviceId ? device.deviceFingerprint === deviceId : false,
    }))

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error fetching trusted devices:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trusted devices' },
      { status: 500 }
    )
  }
}
