export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'

const prismaClient = prisma as any

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where: Record<string, any> = {}
    if (status) {
      where.status = status.toUpperCase()
    }

    const grievances = await prismaClient.grievance.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: grievances })
  } catch (error) {
    console.error('Error fetching grievances:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch grievances' },
      { status: 500 }
    )
  }
}
