export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await getServerSession()

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
    return null
  }

  return session
}

export async function GET(request: NextRequest) {
  try {
    const session = await requireAdmin()

    if (!session) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Fetch all stats in parallel
    const [
      pendingRequests,
      completedRequests7d,
      completedRequests30d,
      totalOrders,
      recentOrders,
      pendingPaymentOrders,
      newUsers7d,
      newUsers30d,
      revenueStats,
      siteSettings,
      recentActivity,
    ] = await Promise.all([
      // Pending requests
      prisma.projectRequest.count({
        where: { status: 'PENDING' },
      }),

      // Completed requests (7 days)
      prisma.projectRequest.count({
        where: {
          status: 'COMPLETED',
          updatedAt: { gte: sevenDaysAgo },
        },
      }),

      // Completed requests (30 days)
      prisma.projectRequest.count({
        where: {
          status: 'COMPLETED',
          updatedAt: { gte: thirtyDaysAgo },
        },
      }),

      // Total orders
      prisma.order.count(),

      // Recent orders (last 7 days)
      prisma.order.count({
        where: { createdAt: { gte: sevenDaysAgo } },
      }),

      // Pending payment orders
      prisma.order.count({
        where: { paymentStatus: 'PENDING' },
      }),

      // New users (7 days)
      prisma.user.count({
        where: { createdAt: { gte: sevenDaysAgo } },
      }),

      // New users (30 days)
      prisma.user.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),

      // Revenue stats
      prisma.order.aggregate({
        where: {
          paymentStatus: 'COMPLETED',
        },
        _sum: { total: true },
        _avg: { total: true },
        _count: true,
      }),

      // Site settings
      prisma.siteSettings.findUnique({
        where: { id: 'site_settings_singleton' },
        select: {
          maintenanceMode: true,
          availableForBusiness: true,
        },
      }),

      // Recent activity (last 10 audit logs)
      prisma.auditLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
    ])

    const stats = {
      pendingRequests,
      completedRequests: {
        last7Days: completedRequests7d,
        last30Days: completedRequests30d,
      },
      orders: {
        total: totalOrders,
        recent: recentOrders,
        pendingPayment: pendingPaymentOrders,
      },
      users: {
        new7Days: newUsers7d,
        new30Days: newUsers30d,
      },
      revenue: {
        total: Number(revenueStats._sum.total || 0),
        average: Number(revenueStats._avg.total || 0),
        orderCount: revenueStats._count,
      },
      system: {
        maintenanceMode: siteSettings?.maintenanceMode || false,
        availableForBusiness: siteSettings?.availableForBusiness !== false,
        lastChecked: now.toISOString(),
        status: 'ok', // Simple health check
      },
      recentActivity: recentActivity.map((log) => ({
        id: log.id,
        action: log.action,
        resource: log.resource,
        resourceId: log.resourceId,
        userName: log.user?.name || log.user?.email || 'System',
        createdAt: log.createdAt,
      })),
    }

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}
