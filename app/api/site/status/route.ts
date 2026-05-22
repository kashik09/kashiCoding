import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const settings = await prisma.siteSettings.upsert({
      where: { id: 'site_settings_singleton' },
      update: {},
      create: {
        id: 'site_settings_singleton',
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        maintenanceMode: settings.maintenanceMode,
        availableForBusiness: settings.availableForBusiness,
        availabilityStatus: settings.availabilityStatus,
        availabilityMessage: settings.availabilityMessage,
      },
    })
  } catch (error) {
    console.error('Error fetching site status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to load site status' },
      { status: 500 }
    )
  }
}
