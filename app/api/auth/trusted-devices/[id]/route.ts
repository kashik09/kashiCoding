import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import {
  ADMIN_DEVICE_ID_COOKIE,
  ADMIN_TRUST_DEVICE_COOKIE,
  ADMIN_STEPUP_COOKIE,
  ADMIN_LAST_ACTIVE_COOKIE,
} from '@/lib/admin-security'

const ADMIN_ROLES = new Set(['ADMIN', 'OWNER', 'MODERATOR', 'EDITOR'])

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id || !ADMIN_ROLES.has(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    const device = await prisma.deviceSession.findUnique({
      where: { id: params.id },
      select: { id: true, userId: true, deviceFingerprint: true },
    })

    if (!device || device.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Device not found' },
        { status: 404 }
      )
    }

    await prisma.deviceSession.updateMany({
      where: { id: device.id },
      data: {
        blocked: true,
        blockedReason: 'revoked',
        trustedUntil: new Date(),
      },
    })

    const response = NextResponse.json({ success: true })

    const currentDeviceId = request.cookies.get(ADMIN_DEVICE_ID_COOKIE)?.value
    if (currentDeviceId && currentDeviceId === device.deviceFingerprint) {
      response.cookies.set(ADMIN_TRUST_DEVICE_COOKIE, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
      })
      response.cookies.set(ADMIN_STEPUP_COOKIE, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
      })
      response.cookies.set(ADMIN_LAST_ACTIVE_COOKIE, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
      })
    }

    return response
  } catch (error) {
    console.error('Error revoking trusted device:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to revoke trusted device' },
      { status: 500 }
    )
  }
}
