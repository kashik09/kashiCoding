import { OrderStatus, PaymentStatus, AuditAction } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { generateLicenseKey } from '@/lib/license'
import { refundCredits } from '@/lib/credits'

/**
 * Check if an order can be fulfilled
 */
export async function canFulfillOrder(orderId: string): Promise<{
  canFulfill: boolean
  reason?: string
}> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!order) {
      return {
        canFulfill: false,
        reason: 'Order not found',
      }
    }

    // Check if order is in a fulfillable state
    if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.PROCESSING) {
      return {
        canFulfill: false,
        reason: `Order is in ${order.status} status and cannot be fulfilled`,
      }
    }

    // Check if payment is completed (for ONE_TIME purchases)
    if (order.purchaseType === 'ONE_TIME' && order.paymentStatus !== PaymentStatus.COMPLETED) {
      return {
        canFulfill: false,
        reason: 'Payment has not been completed',
      }
    }

    // Check if all products still exist and are published
    for (const item of order.items) {
      if (!item.product) {
        return {
          canFulfill: false,
          reason: `Product ${item.productName} no longer exists`,
        }
      }

      if (!item.product.published) {
        return {
          canFulfill: false,
          reason: `Product ${item.productName} is no longer available`,
        }
      }
    }

    return {
      canFulfill: true,
    }
  } catch (error: any) {
    console.error('Error checking if order can be fulfilled:', error)
    return {
      canFulfill: false,
      reason: error.message || 'Failed to validate order',
    }
  }
}

/**
 * Fulfill an order by issuing licenses for all order items
 */
export async function fulfillOrder(orderId: string): Promise<{
  success: boolean
  error?: string
  licenseIds?: string[]
}> {
  try {
    // Validate order can be fulfilled
    const validation = await canFulfillOrder(orderId)
    if (!validation.canFulfill) {
      return {
        success: false,
        error: validation.reason,
      }
    }

    // Get order with all details
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    })

    if (!order) {
      return {
        success: false,
        error: 'Order not found',
      }
    }

    const licenseIds: string[] = []

    // Fulfill order in a transaction
    await prisma.$transaction(async (tx) => {
      // Update order status to PROCESSING
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.PROCESSING,
        },
      })

      // Issue a license for each order item
      for (const item of order.items) {
        // Generate unique license key
        const licenseKey = generateLicenseKey()

        // Create license
        const license = await tx.license.create({
          data: {
            userId: order.userId,
            productId: item.productId,
            licenseKey,
            licenseType: item.licenseType,
            status: 'ACTIVE',
            maxUsers: item.licenseType === 'TEAM' ? 5 : 1,
            currentUsers: 0,
          },
        })

        licenseIds.push(license.id)

        // Link license to order item
        await tx.orderItem.update({
          where: { id: item.id },
          data: {
            licenseId: license.id,
          },
        })

        // Create DigitalProductPurchase for backward compatibility
        await tx.digitalProductPurchase.create({
          data: {
            userId: order.userId,
            productId: item.productId,
            licenseType: item.licenseType,
            price: item.price,
            currency: item.currency,
            paymentStatus: PaymentStatus.COMPLETED,
            paymentMethod: order.paymentMethod,
            transactionId: order.transactionId,
          },
        })

        // Increment product purchase count
        await tx.digitalProduct.update({
          where: { id: item.productId },
          data: {
            purchaseCount: { increment: 1 },
          },
        })

        // Create audit log for license issuance
        await tx.auditLog.create({
          data: {
            userId: order.userId,
            action: AuditAction.LICENSE_ISSUED,
            resource: 'License',
            resourceId: license.id,
            details: {
              orderId: order.id,
              orderNumber: order.orderNumber,
              productId: item.productId,
              productName: item.productName,
              licenseType: item.licenseType,
              licenseKey: license.licenseKey,
            },
          },
        })
      }

      // Update order status to COMPLETED
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.COMPLETED,
          fulfilledAt: new Date(),
        },
      })

      // Create audit log for order fulfillment
      await tx.auditLog.create({
        data: {
          userId: order.userId,
          action: AuditAction.PROJECT_CREATED, // Using existing action, you may want to add ORDER_FULFILLED
          resource: 'Order',
          resourceId: order.id,
          details: {
            orderNumber: order.orderNumber,
            purchaseType: order.purchaseType,
            total: order.total.toString(),
            currency: order.currency,
            itemCount: order.items.length,
            licenseIds,
          },
        },
      })
    })

    // TODO: Send license issued email
    // await sendLicenseIssuedEmail(orderId)

    return {
      success: true,
      licenseIds,
    }
  } catch (error: any) {
    console.error('Error fulfilling order:', error)
    return {
      success: false,
      error: error.message || 'Failed to fulfill order',
    }
  }
}

/**
 * Cancel an order
 */
export async function cancelOrder(
  orderId: string,
  reason: string,
  cancelledBy: string
): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            license: true,
          },
        },
      },
    })

    if (!order) {
      return {
        success: false,
        error: 'Order not found',
      }
    }

    // Only allow cancellation of PENDING or PROCESSING orders
    if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.PROCESSING) {
      return {
        success: false,
        error: `Order in ${order.status} status cannot be cancelled`,
      }
    }

    // Check if any licenses have been issued
    const hasIssuedLicenses = order.items.some((item) => item.license !== null)
    if (hasIssuedLicenses) {
      return {
        success: false,
        error: 'Order has issued licenses and cannot be cancelled. Please contact support.',
      }
    }

    await prisma.$transaction(async (tx) => {
      // Refund credits if this was a credit purchase
      if (order.purchaseType === 'CREDITS' && order.membershipId && order.creditsUsed) {
        await refundCredits({
          userId: order.userId,
          membershipId: order.membershipId,
          amount: order.creditsUsed,
          description: `Order ${order.orderNumber} cancelled: ${reason}`,
          reference: order.id,
          performedBy: cancelledBy,
        })
      }

      // Update order status
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.CANCELLED,
        },
      })

      // Create audit log
      await tx.auditLog.create({
        data: {
          userId: cancelledBy,
          action: AuditAction.PROJECT_CREATED, // Using existing action, you may want to add ORDER_CANCELLED
          resource: 'Order',
          resourceId: order.id,
          details: {
            orderNumber: order.orderNumber,
            reason,
            cancelledBy,
            refundedCredits: order.creditsUsed || 0,
          },
        },
      })
    })

    // TODO: Send cancellation email
    // await sendOrderCancelledEmail(orderId, reason)

    return {
      success: true,
    }
  } catch (error: any) {
    console.error('Error cancelling order:', error)
    return {
      success: false,
      error: error.message || 'Failed to cancel order',
    }
  }
}

/**
 * Get order fulfillment status
 */
export async function getOrderFulfillmentStatus(orderId: string): Promise<{
  isFulfilled: boolean
  fulfilledAt?: Date
  licenses?: Array<{
    id: string
    licenseKey: string
    licenseType: string
    productName: string
  }>
}> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            license: true,
            product: true,
          },
        },
      },
    })

    if (!order) {
      return {
        isFulfilled: false,
      }
    }

    const isFulfilled = order.status === OrderStatus.COMPLETED

    if (isFulfilled && order.fulfilledAt) {
      const licenses = order.items
        .filter((item) => item.license !== null)
        .map((item) => ({
          id: item.license!.id,
          licenseKey: item.license!.licenseKey,
          licenseType: item.license!.licenseType,
          productName: item.productName,
        }))

      return {
        isFulfilled: true,
        fulfilledAt: order.fulfilledAt,
        licenses,
      }
    }

    return {
      isFulfilled,
    }
  } catch (error) {
    console.error('Error getting order fulfillment status:', error)
    return {
      isFulfilled: false,
    }
  }
}
