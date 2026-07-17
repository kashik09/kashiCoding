import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, getRateLimitHeaders, getRateLimitKey } from '@/lib/rate-limit'
import { canApplyForVerification } from '@/lib/discounts'
import type { VerificationMethod, DiscountType } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limiting: max 3 applications per 24 hours
    const rateLimit = checkRateLimit(
      getRateLimitKey(request, 'student-verification'),
      3,
      24 * 60 * 60 * 1000
    )

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many verification attempts. Please try again later.' },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimit),
        }
      )
    }

    // Check cooldown
    const canApply = await canApplyForVerification(session.user.id)
    if (!canApply.canApply) {
      return NextResponse.json(
        {
          error: canApply.reason || 'Cannot apply for verification at this time',
          nextAvailableAt: canApply.nextAvailableAt,
        },
        { status: 400 }
      )
    }

    // Parse request body
    const body = await request.json()
    const {
      method,
      institutionName,
      country,
      schoolEmail,
      evidenceUrl,
      discountType,
      guardianEmail,
      guardianConsent,
    } = body

    // Validation
    if (!method || !institutionName || !country || !discountType) {
      return NextResponse.json(
        { error: 'Missing required fields: method, institutionName, country, discountType' },
        { status: 400 }
      )
    }

    if (!['SCHOOL_EMAIL', 'ID_UPLOAD', 'MANUAL'].includes(method)) {
      return NextResponse.json({ error: 'Invalid verification method' }, { status: 400 })
    }

    if (!['STUDENT', 'YOUTH_13_18'].includes(discountType)) {
      return NextResponse.json({ error: 'Invalid discount type' }, { status: 400 })
    }

    // Youth 13-18 requires guardian consent
    if (discountType === 'YOUTH_13_18') {
      if (!guardianEmail || !guardianConsent) {
        return NextResponse.json(
          { error: 'Youth verification requires guardian email and consent' },
          { status: 400 }
        )
      }

      // Basic email validation for guardian
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guardianEmail)) {
        return NextResponse.json({ error: 'Invalid guardian email format' }, { status: 400 })
      }
    }

    // School email validation if provided
    if (method === 'SCHOOL_EMAIL') {
      if (!schoolEmail) {
        return NextResponse.json(
          { error: 'School email required for email verification method' },
          { status: 400 }
        )
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(schoolEmail)) {
        return NextResponse.json({ error: 'Invalid school email format' }, { status: 400 })
      }

      // Check if school email domain looks educational
      const domain = schoolEmail.split('@')[1].toLowerCase()
      const eduDomains = ['.edu', '.ac.', '.edu.', 'school', 'university', 'college']
      const isEducationalDomain = eduDomains.some((edu) => domain.includes(edu))

      if (!isEducationalDomain) {
        return NextResponse.json(
          {
            error:
              'Email domain does not appear to be educational. Please use your school-issued email or choose ID upload method.',
          },
          { status: 400 }
        )
      }
    }

    // ID upload validation
    if (method === 'ID_UPLOAD' && !evidenceUrl) {
      return NextResponse.json(
        { error: 'Evidence file required for ID upload method' },
        { status: 400 }
      )
    }

    // Create or update verification request
    const existing = await prisma.studentVerification.findUnique({
      where: { userId: session.user.id },
    })

    let verification
    if (existing) {
      // Update existing
      verification = await prisma.studentVerification.update({
        where: { id: existing.id },
        data: {
          method: method as VerificationMethod,
          institutionName,
          country,
          schoolEmail: schoolEmail || null,
          evidenceUrl: evidenceUrl || null,
          discountType: discountType as DiscountType,
          guardianEmail: guardianEmail || null,
          guardianConsent: guardianConsent || false,
          status: 'PENDING', // Reset to pending
          lastApplicationAt: new Date(),
          notes: null, // Clear previous admin notes
          reviewedBy: null,
          reviewedAt: null,
        },
      })
    } else {
      // Create new
      verification = await prisma.studentVerification.create({
        data: {
          userId: session.user.id,
          method: method as VerificationMethod,
          institutionName,
          country,
          schoolEmail: schoolEmail || null,
          evidenceUrl: evidenceUrl || null,
          discountType: discountType as DiscountType,
          guardianEmail: guardianEmail || null,
          guardianConsent: guardianConsent || false,
          status: 'PENDING',
          lastApplicationAt: new Date(),
        },
      })
    }

    // Log audit event
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'STUDENT_VERIFICATION_SUBMITTED',
        resource: 'StudentVerification',
        resourceId: verification.id,
        details: {
          method,
          institutionName,
          country,
          discountType,
        },
      },
    })

    return NextResponse.json(
      {
        success: true,
        verification: {
          id: verification.id,
          status: verification.status,
          method: verification.method,
          discountType: verification.discountType,
        },
        message: 'Verification request submitted successfully. We will review it within 1-2 business days.',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error submitting student verification:', error)
    return NextResponse.json({ error: 'Failed to submit verification request' }, { status: 500 })
  }
}
