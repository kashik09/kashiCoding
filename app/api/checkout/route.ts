import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getCartWithItems, clearCart, calculateCartTotal } from '@/lib/cart'
import { generateOrderNumber } from '@/lib/order-number'
import { getProvider } from '@/lib/payment/providers'
import { sendOrderConfirmationEmail, sendPaymentInstructionsEmail } from '@/lib/email/order-emails'
import { OrderPurchaseType, PaymentStatus, OrderStatus, AuditAction } from '@prisma/client'
import { canUserPurchase } from '@/lib/suspension-middleware'
import { getUserDiscountEligibility, calculateDiscountedPrice } from '@/lib/discounts'

/**
 * POST /api/checkout
 * Create order from cart
 * Handles one-time payment purchases
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

    const finalPurchaseType: OrderPurchaseType = 'ONE_TIME'

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

    // Check if user is suspended
    const purchasePermission = await canUserPurchase(session.user.id)
    if (!purchasePermission.allowed) {
      return NextResponse.json(
        { error: purchasePermission.reason || 'Cannot make purchases at this time' },
        { status: 403 }
      )
    }

    // Check for discount eligibility
    const discountEligibility = await getUserDiscountEligibility(session.user.id)
    const subtotalValue = Number(totals.subtotal)
    const taxValue = Number(totals.tax)
    const totalValue = Number(totals.total)
    let finalSubtotal = subtotalValue
    let finalTotal = totalValue
    let discountAmount = 0

    if (discountEligibility.eligible) {
      // Calculate discounted prices
      const discountedSubtotal = calculateDiscountedPrice(
        Number(totals.subtotal),
        discountEligibility.discountPercent
      )
      discountAmount = subtotalValue - discountedSubtotal
      finalSubtotal = discountedSubtotal

      // Recalculate total (subtotal + tax)
      const taxRate = subtotalValue > 0 ? taxValue / subtotalValue : 0
      const discountedTax = discountedSubtotal * taxRate
      finalTotal = discountedSubtotal + discountedTax
    }

    // Create order in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: session.user.id,
          subtotal: finalSubtotal,
          tax: discountEligibility.eligible
            ? finalTotal - finalSubtotal
            : taxValue,
          total: finalTotal,
          currency,
          paymentStatus: PaymentStatus.PENDING,
          paymentMethod,
          paymentProvider: paymentMethod,
          purchaseType: finalPurchaseType,
          status: OrderStatus.PENDING,
          termsAccepted: true,
          termsVersion: '1.0', // TODO: Get from settings
          customerEmail: user.email,
          customerName: user.name || undefined,
          discountApplied: discountEligibility.eligible,
          discountType: discountEligibility.discountType,
          discountPercent: discountEligibility.eligible
            ? discountEligibility.discountPercent
            : 0,
          discountAmount: discountAmount,
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

    // For one-time purchases, get payment instructions
    let paymentInstructions = null
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
      message: 'Order created! Please complete payment to receive your licenses.',
    })
  } catch (error: any) {
    console.error('Error processing checkout:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process checkout' },
      { status: 500 }
    )
  }
}
