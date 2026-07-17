export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { requireAdminStepUp } from '@/lib/admin-stepup'

const ADMIN_ROLES = new Set(['ADMIN', 'OWNER', 'MODERATOR', 'EDITOR'])
const SETTINGS_SLUG = 'security_settings'
const DEFAULT_SESSION_TIMEOUT = '30'
const ALLOWED_SESSION_TIMEOUTS = new Set(['15', '30', '60', '120', '1440'])

async function requireAdminRole() {
  const session = await getServerSession()
  if (!session || !ADMIN_ROLES.has(session.user.role)) return null
  return session
}

function coerceTimeout(value: unknown): string | null {
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length ? trimmed : null
}

// GET /api/admin/security-settings - Fetch security settings
export async function GET() {
  try {
    const session = await requireAdminRole()
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    const settings = await prisma.pageContent.findUnique({
      where: { slug: SETTINGS_SLUG },
      select: { data: true },
    })

    const data = settings?.data as { sessionTimeout?: string } | null
    const sessionTimeout =
      data?.sessionTimeout && ALLOWED_SESSION_TIMEOUTS.has(data.sessionTimeout)
        ? data.sessionTimeout
        : DEFAULT_SESSION_TIMEOUT

    return NextResponse.json({
      success: true,
      data: { sessionTimeout },
    })
  } catch (error) {
    console.error('Error fetching security settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch security settings' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/security-settings - Update security settings
export async function PATCH(request: NextRequest) {
  try {
    const session = await requireAdminRole()
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    const stepUp = await requireAdminStepUp(request, session)
    if (stepUp) return stepUp

    const body = await request.json().catch(() => null)
    const rawTimeout = coerceTimeout(body?.sessionTimeout)
    if (!rawTimeout || !ALLOWED_SESSION_TIMEOUTS.has(rawTimeout)) {
      return NextResponse.json(
        { success: false, error: 'Invalid session timeout' },
        { status: 400 }
      )
    }

    await prisma.pageContent.upsert({
      where: { slug: SETTINGS_SLUG },
      update: { data: { sessionTimeout: rawTimeout } },
      create: { slug: SETTINGS_SLUG, data: { sessionTimeout: rawTimeout } },
    })

    return NextResponse.json({
      success: true,
      data: { sessionTimeout: rawTimeout },
    })
  } catch (error) {
    console.error('Error updating security settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update security settings' },
      { status: 500 }
    )
  }
}
