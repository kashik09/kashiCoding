import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { fulfillOrder } from '@/lib/order-fulfillment'
import { sendLicenseIssuedEmail } from '@/lib/email/order-emails'
import { PaymentStatus, AuditAction } from '@prisma/client'

/**
 * POST /api/payment/manual/confirm
 * Admin confirms manual payment and fulfills order
 * Requires admin role
 */
export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin()

    const body = await request.json()
    const { orderNumber, transactionId } = body

    // Validate input
    if (!orderNumber) {
      return NextResponse.json(
        { error: 'Order number is required' },
        { status: 400 }
      )
    }

    // Get order
    const order = await prisma.order.findUnique({
      where: { orderNumber },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Check if order is eligible for payment confirmation
    if (order.purchaseType !== 'ONE_TIME') {
      return NextResponse.json(
        { error: 'Only one-time purchase orders can have manual payment confirmation' },
        { status: 400 }
      )
    }

    if (order.paymentStatus === PaymentStatus.COMPLETED) {
      return NextResponse.json(
        { error: 'Payment has already been confirmed' },
        { status: 400 }
      )
    }

    // Update order payment status in a transaction
    await prisma.$transaction(async (tx) => {
      // Update payment status
      await tx.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: PaymentStatus.COMPLETED,
          transactionId: transactionId || `MANUAL-${Date.now()}`,
        },
      })

      // Create audit log
      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          action: AuditAction.SETTINGS_CHANGED, // Using existing action, add PAYMENT_CONFIRMED later
          resource: 'Order',
          resourceId: order.id,
          details: {
            orderNumber,
            action: 'PAYMENT_CONFIRMED',
            transactionId: transactionId || `MANUAL-${Date.now()}`,
            confirmedBy: session.user.id,
          },
        },
      })
    })

    // Fulfill order (issue licenses)
    const fulfillmentResult = await fulfillOrder(order.id)

    if (!fulfillmentResult.success) {
      return NextResponse.json(
        {
          error: 'Payment confirmed but order fulfillment failed',
          details: fulfillmentResult.error,
        },
        { status: 500 }
      )
    }

    // Send license issued email
    await sendLicenseIssuedEmail(order.id)

    // Get updated order
    const updatedOrder = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            product: true,
            license: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: 'Payment confirmed and order fulfilled successfully',
    })
  } catch (error: any) {
    console.error('Error confirming manual payment:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to confirm payment' },
      { status: 500 }
    )
  }
}
