import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication and authorization
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const allowedRoles = ['ADMIN', 'OWNER']
    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = params
    const body = await request.json()
    const { notes, durationMonths } = body

    // Default 12 months expiry
    const duration = durationMonths || 12
    const expiresAt = new Date()
    expiresAt.setMonth(expiresAt.getMonth() + duration)

    // Get verification
    const verification = await prisma.studentVerification.findUnique({
      where: { id },
      include: { user: { select: { id: true, email: true, name: true } } },
    })

    if (!verification) {
      return NextResponse.json({ error: 'Verification not found' }, { status: 404 })
    }

    if (verification.status !== 'PENDING') {
      return NextResponse.json(
        { error: `Verification is already ${verification.status}` },
        { status: 400 }
      )
    }

    // Update verification to approved
    const updated = await prisma.studentVerification.update({
      where: { id },
      data: {
        status: 'APPROVED',
        reviewedBy: session.user.id,
        reviewedAt: new Date(),
        expiresAt,
        notes: notes || null,
      },
    })

    // Log audit event
    await prisma.auditLog.create({
      data: {
        userId: verification.userId,
        action: 'STUDENT_VERIFICATION_APPROVED',
        resource: 'StudentVerification',
        resourceId: id,
        details: {
          reviewedBy: session.user.id,
          reviewerEmail: session.user.email,
          discountType: verification.discountType,
          institutionName: verification.institutionName,
          expiresAt,
          notes,
        },
      },
    })

    // TODO: Send approval email to user
    // await sendStudentVerificationApprovedEmail(verification.user.email, {
    //   discountType: verification.discountType,
    //   expiresAt,
    // })

    return NextResponse.json(
      {
        success: true,
        verification: updated,
        message: `Verification approved. Student discount active until ${expiresAt.toLocaleDateString()}`,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error approving student verification:', error)
    return NextResponse.json({ error: 'Failed to approve verification' }, { status: 500 })
  }
}
