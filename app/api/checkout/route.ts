import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getCartWithItems, clearCart, calculateCartTotal } from '@/lib/cart'
import { generateOrderNumber } from '@/lib/order-number'
import { hasAvailableCredits, deductCredits } from '@/lib/credits'
import { fulfillOrder } from '@/lib/order-fulfillment'
import { getProvider } from '@/lib/payment/providers'
import { sendOrderConfirmationEmail, sendPaymentInstructionsEmail } from '@/lib/email/order-emails'
import { OrderPurchaseType, PaymentStatus, OrderStatus, AuditAction } from '@prisma/client'

/**
 * POST /api/checkout
 * Create order from cart
 * Handles both one-time payment and credit purchases
 * Requires authentication
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      paymentMethod = 'MANUAL',
      termsAccepted,
      purchaseType, // 'ONE_TIME' or 'CREDITS'
      currency = 'USD',
    } = body

    // Validate terms acceptance
    if (!termsAccepted) {
      return NextResponse.json(
        { error: 'You must accept the terms and conditions' },
        { status: 400 }
      )
    }

    // Get cart
    const cart = await getCartWithItems(session.user.id)

    if (!cart.items || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // Calculate totals
    const totals = await calculateCartTotal(session.user.id, currency)

    // Verify all products are still available and published
    for (const item of cart.items) {
      if (!item.product || !item.product.published) {
        return NextResponse.json(
          { error: `Product "${item.product?.name || 'Unknown'}" is no longer available` },
          { status: 400 }
        )
      }
    }

    // Determine purchase type if not specified
    let finalPurchaseType = purchaseType
    let creditsRequired = 0
    let membershipId: string | undefined

    if (purchaseType === 'CREDITS') {
      creditsRequired = totals.creditsRequired || 0

      if (creditsRequired === 0) {
        return NextResponse.json(
          { error: 'Products in cart cannot be purchased with credits' },
          { status: 400 }
        )
      }

      // Check if user has sufficient credits
      const creditCheck = await hasAvailableCredits(session.user.id, creditsRequired)

      if (!creditCheck.hasCredits) {
        return NextResponse.json(
          {
            error: 'Insufficient credits',
            details: {
              required: creditsRequired,
              available: creditCheck.availableCredits,
            },
          },
          { status: 400 }
        )
      }

      membershipId = creditCheck.membershipId
    } else {
      finalPurchaseType = 'ONE_TIME'
    }

    // Generate order number
    const orderNumber = await generateOrderNumber()

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Create order in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: session.user.id,
          subtotal: totals.subtotal,
          tax: totals.tax,
          total: totals.total,
          currency,
          paymentStatus: finalPurchaseType === 'CREDITS' ? PaymentStatus.COMPLETED : PaymentStatus.PENDING,
          paymentMethod: finalPurchaseType === 'CREDITS' ? 'CREDITS' : paymentMethod,
          paymentProvider: finalPurchaseType === 'CREDITS' ? null : paymentMethod,
          purchaseType: finalPurchaseType as OrderPurchaseType,
          creditsUsed: finalPurchaseType === 'CREDITS' ? creditsRequired : null,
          membershipId: finalPurchaseType === 'CREDITS' ? membershipId : null,
          status: OrderStatus.PENDING,
          termsAccepted: true,
          termsVersion: '1.0', // TODO: Get from settings
          customerEmail: user.email,
          customerName: user.name || undefined,
        },
        include: {
          items: true,
        },
      })

      // Create order items
      for (const cartItem of cart.items) {
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: cartItem.productId,
            productName: cartItem.product.name,
            productSlug: cartItem.product.slug,
            licenseType: cartItem.licenseType,
            price: Number(cartItem.product.usdPrice || cartItem.product.price),
            currency: 'USD', // Store in base currency
          },
        })
      }

      // If credit purchase, deduct credits
      if (finalPurchaseType === 'CREDITS' && membershipId) {
        await deductCredits({
          userId: session.user.id,
          membershipId,
          amount: creditsRequired,
          description: `Order ${orderNumber}`,
          reference: newOrder.id,
        })
      }

      // Create audit log
      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          action: AuditAction.PROJECT_CREATED, // Using existing action, add ORDER_CREATED later
          resource: 'Order',
          resourceId: newOrder.id,
          details: {
            orderNumber,
            purchaseType: finalPurchaseType,
            total: totals.total,
            currency,
            itemCount: cart.items.length,
          },
        },
      })

      return newOrder
    })

    // Clear cart
    await clearCart(session.user.id)

    // If credit purchase, auto-fulfill immediately
    if (finalPurchaseType === 'CREDITS') {
      const fulfillmentResult = await fulfillOrder(order.id)

      if (fulfillmentResult.success) {
        // Send order confirmation and license issued emails
        await sendOrderConfirmationEmail(order.id)
        await require('@/lib/email/order-emails').sendLicenseIssuedEmail(order.id)

        // Get updated order with licenses
        const fulfilledOrder = await prisma.order.findUnique({
          where: { id: order.id },
          include: {
            items: {
              include: {
                license: true,
                product: true,
              },
            },
          },
        })

        return NextResponse.json({
          success: true,
          order: fulfilledOrder,
          fulfilled: true,
          message: 'Order placed successfully! Your licenses have been issued.',
        })
      }
    }

    // For one-time purchases, get payment instructions
    let paymentInstructions = null
    if (finalPurchaseType === 'ONE_TIME') {
      const provider = getProvider(paymentMethod)

      if (provider) {
        const paymentIntent = await provider.createPaymentIntent({
          orderId: order.id,
          orderNumber,
          amount: totals.total,
          currency,
          customerEmail: user.email,
          customerName: user.name || undefined,
        })

        paymentInstructions = paymentIntent.instructions

        // Send order confirmation and payment instructions emails
        await sendOrderConfirmationEmail(order.id)
        if (paymentInstructions) {
          await sendPaymentInstructionsEmail(order.id, paymentInstructions)
        }
      }
    }

    // Get created order with items
    const createdOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      order: createdOrder,
      paymentInstructions,
      message: finalPurchaseType === 'CREDITS'
        ? 'Order placed successfully!'
        : 'Order created! Please complete payment to receive your licenses.',
    })
  } catch (error: any) {
    console.error('Error processing checkout:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process checkout' },
      { status: 500 }
    )
  }
}
