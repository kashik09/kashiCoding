import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getMembershipPlan } from '@/lib/membership-plans'
import { MembershipTier, MembershipStatus, CreditTransactionType, AuditAction } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { tier } = body

    if (!tier || !Object.values(MembershipTier).includes(tier)) {
      return NextResponse.json(
        { error: 'Invalid membership tier' },
        { status: 400 }
      )
    }

    // Get membership plan details
    const plan = getMembershipPlan(tier as MembershipTier)
    if (!plan) {
      return NextResponse.json(
        { error: 'Membership plan not found' },
        { status: 404 }
      )
    }

    // TODO: PAYMENT INTEGRATION REQUIRED
    // Before creating the membership, you need to:
    // 1. Integrate a payment provider (Stripe, PayPal, etc.)
    // 2. Create a payment intent/session
    // 3. Verify payment completion
    // 4. Only then create the membership
    //
    // Example with Stripe:
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: plan.price * 100, // Convert to cents
    //   currency: 'usd',
    //   metadata: { userId: session.user.id, tier: plan.tier }
    // })
    //
    // For now, this is a demo implementation that creates memberships without payment

    // Check if user already has an active membership
    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { membership: true },
    })

    if (existingUser?.membership && existingUser.membership.status === MembershipStatus.ACTIVE) {
      return NextResponse.json(
        { error: 'You already have an active membership. Please cancel or wait for it to expire before purchasing a new one.' },
        { status: 400 }
      )
    }

    // Calculate membership dates
    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + plan.durationDays)

    // Create membership and assign to user in a transaction
    const membership = await prisma.$transaction(async (tx) => {
      // Create membership
      const newMembership = await tx.membership.create({
        data: {
          tier: plan.tier,
          totalCredits: plan.credits,
          usedCredits: 0,
          remainingCredits: plan.credits,
          rolloverCredits: 0,
          rolloverCap: plan.rolloverCap,
          startDate,
          endDate,
          autoRenew: false,
          status: MembershipStatus.ACTIVE,
        },
      })

      // Assign membership to user
      await tx.user.update({
        where: { id: session.user.id },
        data: { membershipId: newMembership.id },
      })

      // Create initial credit transaction
      await tx.creditTransaction.create({
        data: {
          userId: session.user.id,
          membershipId: newMembership.id,
          type: CreditTransactionType.INITIAL_ALLOCATION,
          amount: plan.credits,
          balance: plan.credits,
          description: `Initial credit allocation for ${plan.name} membership`,
        },
      })

      // Create audit log
      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          action: AuditAction.MEMBERSHIP_CREATED,
          resource: 'Membership',
          resourceId: newMembership.id,
          details: {
            tier: plan.tier,
            credits: plan.credits,
            price: plan.price,
          },
        },
      })

      return newMembership
    })

    return NextResponse.json({
      success: true,
      membership: {
        id: membership.id,
        tier: membership.tier,
        totalCredits: membership.totalCredits,
        remainingCredits: membership.remainingCredits,
        startDate: membership.startDate.toISOString(),
        endDate: membership.endDate.toISOString(),
        status: membership.status,
      },
    })
  } catch (error: any) {
    console.error('Error creating membership:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create membership' },
      { status: 500 }
    )
  }
}
