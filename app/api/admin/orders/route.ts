export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/admin/orders
 * List all orders with filters (admin only)
 * Requires admin role
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const paymentStatus = searchParams.get('paymentStatus')
    const search = searchParams.get('search')
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build where clause
    const where: any = {}

    if (status) {
      where.status = status
    }

    if (paymentStatus) {
      where.paymentStatus = paymentStatus
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { customerEmail: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (from || to) {
      where.createdAt = {}
      if (from) {
        where.createdAt.gte = new Date(from)
      }
      if (to) {
        where.createdAt.lte = new Date(to)
      }
    }

    // Fetch orders
    const [orders, totalCount, stats] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: offset,
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  thumbnailUrl: true,
                },
              },
              license: {
                select: {
                  id: true,
                  status: true,
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
        },
      }),
      prisma.order.count({ where }),
      // Get stats
      prisma.$transaction([
        prisma.order.count({ where: { status: 'PENDING' } }),
        prisma.order.count({ where: { status: 'COMPLETED' } }),
        prisma.order.count({ where: { paymentStatus: 'PENDING' } }),
        prisma.order.aggregate({
          _sum: {
            total: true,
          },
          where: {
            status: 'COMPLETED',
          },
        }),
      ]),
    ])

    const [pendingCount, completedCount, awaitingPaymentCount, revenueData] = stats

    return NextResponse.json({
      orders,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
      stats: {
        totalOrders: totalCount,
        pendingOrders: pendingCount,
        completedOrders: completedCount,
        awaitingPayment: awaitingPaymentCount,
        totalRevenue: revenueData._sum.total || 0,
      },
      filters: {
        status,
        paymentStatus,
        search,
        from,
        to,
      },
    })
  } catch (error: any) {
    console.error('Error fetching admin orders:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
