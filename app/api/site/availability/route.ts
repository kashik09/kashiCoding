export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateEffectiveAvailability } from '@/lib/availability'

// GET /api/site/availability - Fetch public availability status
export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 'site_settings_singleton' },
      select: {
        availabilityStatus: true,
        availabilityMessage: true,
        leaveStart: true,
        leaveEnd: true,
        manualOverride: true,
      },
    })

    if (!settings) {
      // Return default if no settings exist
      return NextResponse.json({
        success: true,
        data: {
          status: 'AVAILABLE',
          message: null,
        },
      })
    }

    // Calculate effective availability based on rules
    const effective = calculateEffectiveAvailability({
      availabilityStatus: settings.availabilityStatus,
      availabilityMessage: settings.availabilityMessage,
      leaveStart: settings.leaveStart,
      leaveEnd: settings.leaveEnd,
      manualOverride: settings.manualOverride,
    })

    return NextResponse.json({
      success: true,
      data: {
        status: effective.status,
        message: effective.message,
      },
    })
  } catch (error) {
    console.error('Error fetching availability:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch availability' },
      { status: 500 }
    )
  }
}
