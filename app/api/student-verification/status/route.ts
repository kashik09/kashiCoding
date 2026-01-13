import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getUserDiscountEligibility } from '@/lib/discounts'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get verification status
    const verification = await prisma.studentVerification.findUnique({
      where: { userId: session.user.id },
      select: {
        id: true,
        status: true,
        method: true,
        institutionName: true,
        country: true,
        discountType: true,
        expiresAt: true,
        createdAt: true,
        reviewedAt: true,
        notes: true,
      },
    })

    if (!verification) {
      return NextResponse.json(
        {
          hasVerification: false,
          status: null,
          message: 'No verification request found',
        },
        { status: 200 }
      )
    }

    // Get discount eligibility
    const eligibility = await getUserDiscountEligibility(session.user.id)

    return NextResponse.json(
      {
        hasVerification: true,
        verification: {
          id: verification.id,
          status: verification.status,
          method: verification.method,
          institutionName: verification.institutionName,
          country: verification.country,
          discountType: verification.discountType,
          expiresAt: verification.expiresAt,
          createdAt: verification.createdAt,
          reviewedAt: verification.reviewedAt,
          adminNotes: verification.notes,
        },
        eligibility: {
          eligible: eligibility.eligible,
          discountPercent: eligibility.discountPercent,
          expiresAt: eligibility.expiresAt,
          reason: eligibility.reason,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching verification status:', error)
    return NextResponse.json({ error: 'Failed to fetch verification status' }, { status: 500 })
  }
}
