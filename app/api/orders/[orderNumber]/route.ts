import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { hasRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/orders/[orderNumber]
 * Get order details
 * Requires authentication + ownership or admin role
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { orderNumber } = params

    // Fetch order
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                thumbnailUrl: true,
                fileSize: true,
                fileType: true,
                version: true,
              },
            },
            license: {
              select: {
                id: true,
                licenseKey: true,
                licenseType: true,
                status: true,
                maxUsers: true,
                currentUsers: true,
                issuedAt: true,
                expiresAt: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        membership: {
          select: {
            id: true,
            tier: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Check authorization
    const isOwner = order.userId === session.user.id
    const isAdmin = session.user.role === 'ADMIN'

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      order,
    })
  } catch (error: any) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch order' },
      { status: 500 }
    )
  }
}
