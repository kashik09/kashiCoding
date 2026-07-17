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
    const { reason } = body

    if (!reason) {
      return NextResponse.json({ error: 'Rejection reason is required' }, { status: 400 })
    }

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

    // Update verification to rejected
    const updated = await prisma.studentVerification.update({
      where: { id },
      data: {
        status: 'REJECTED',
        reviewedBy: session.user.id,
        reviewedAt: new Date(),
        notes: reason,
        lastApplicationAt: new Date(), // Start cooldown
      },
    })

    // Log audit event
    await prisma.auditLog.create({
      data: {
        userId: verification.userId,
        action: 'STUDENT_VERIFICATION_REJECTED',
        resource: 'StudentVerification',
        resourceId: id,
        details: {
          reviewedBy: session.user.id,
          reviewerEmail: session.user.email,
          reason,
          institutionName: verification.institutionName,
        },
      },
    })

    // TODO: Send rejection email to user
    // await sendStudentVerificationRejectedEmail(verification.user.email, {
    //   reason,
    // })

    return NextResponse.json(
      {
        success: true,
        verification: updated,
        message: 'Verification rejected',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error rejecting student verification:', error)
    return NextResponse.json({ error: 'Failed to reject verification' }, { status: 500 })
  }
}
