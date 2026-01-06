import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'

const prismaClient = prisma as any

const VALID_STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED'] as const

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    const body = (await request.json().catch(() => null)) as {
      status?: string
      adminNotes?: string
    } | null

    if (!body) {
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const data: Record<string, any> = {}

    if (body.status) {
      const nextStatus = body.status.toUpperCase()
      if (!VALID_STATUSES.includes(nextStatus as (typeof VALID_STATUSES)[number])) {
        return NextResponse.json(
          { success: false, error: 'Invalid status' },
          { status: 400 }
        )
      }
      data.status = nextStatus
    }

    if (typeof body.adminNotes === 'string') {
      data.adminNotes = body.adminNotes.trim() || null
    }

    if (!Object.keys(data).length) {
      return NextResponse.json(
        { success: false, error: 'No updates provided' },
        { status: 400 }
      )
    }

    const grievance = await prismaClient.grievance.update({
      where: { id: params.id },
      data,
    })

    return NextResponse.json({ success: true, data: grievance })
  } catch (error) {
    console.error('Error updating grievance:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update grievance' },
      { status: 500 }
    )
  }
}
