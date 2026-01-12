import { prisma } from '@/lib/prisma'
import { getEmailConfig, sendEmail } from '@/lib/email'
import { formatPrice } from '@/lib/currency'
import type { SupportedCurrency } from '@/lib/currency'

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail(orderId: string): Promise<{
  success: boolean
  error?: string
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
        user: true,
      },
    })

    if (!order) {
      return {
        success: false,
        error: 'Order not found',
      }
    }

    const itemsList = order.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.productName}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.licenseType}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatPrice(Number(item.price), item.currency as SupportedCurrency)}</td>
        </tr>
      `
      )
      .join('')

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #10b981;">Order Confirmed!</h1>
        <p>Hi ${order.customerName || 'there'},</p>
        <p>Thank you for your order! Your order has been successfully placed.</p>

        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px; color: #6b7280;">Order Number</p>
          <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #1f2937;">${order.orderNumber}</p>
        </div>

        <h2 style="color: #1f2937; font-size: 18px;">Order Details</h2>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: #f9fafb;">
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Product</th>
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">License</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
            <tr>
              <td colspan="2" style="padding: 12px; text-align: right; font-weight: bold;">Total</td>
              <td style="padding: 12px; text-align: right; font-weight: bold;">${formatPrice(Number(order.total), order.currency as SupportedCurrency)}</td>
            </tr>
          </tbody>
        </table>

        ${
          order.paymentStatus === 'PENDING'
            ? `
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; color: #92400e;"><strong>Payment Required:</strong> Your order is pending payment. Please follow the payment instructions sent separately.</p>
        </div>
        `
            : ''
        }

        <p>You can view your order status and download your products from your <a href="${process.env.NEXT_PUBLIC_SITE_URL || ''}/dashboard/orders/${order.orderNumber}" style="color: #3b82f6;">dashboard</a>.</p>

        <p>If you have any questions, feel free to contact us.</p>

        <p>Best regards,<br>Kashi Kweyu</p>
      </div>
    `

    const emailConfig = await getEmailConfig()
    const result = await sendEmail(emailConfig, {
      to: order.customerEmail,
      subject: `Order Confirmation - ${order.orderNumber}`,
      html,
    })

    return result
  } catch (error: any) {
    console.error('Error sending order confirmation email:', error)
    return {
      success: false,
      error: error.message || 'Failed to send order confirmation email',
    }
  }
}

/**
 * Send payment instructions email
 */
export async function sendPaymentInstructionsEmail(
  orderId: string,
  instructions: {
    steps: string[]
    contactInfo?: {
      whatsapp?: string
      email?: string
    }
  }
): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      return {
        success: false,
        error: 'Order not found',
      }
    }

    const stepsList = instructions.steps
      .map((step, index) => `<li style="margin: 10px 0;">${index + 1}. ${step}</li>`)
      .join('')

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #3b82f6;">Payment Instructions</h1>
        <p>Hi ${order.customerName || 'there'},</p>
        <p>To complete your order <strong>${order.orderNumber}</strong>, please follow these payment instructions:</p>

        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0; color: #1f2937;">Payment Details</h2>
          <p><strong>Amount to Pay:</strong> ${formatPrice(Number(order.total), order.currency as SupportedCurrency)}</p>
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        </div>

        <h2 style="color: #1f2937;">Steps to Complete Payment:</h2>
        <ol style="line-height: 1.8;">
          ${stepsList}
        </ol>

        ${
          instructions.contactInfo?.whatsapp || instructions.contactInfo?.email
            ? `
        <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-weight: bold; color: #1e40af;">Contact Information:</p>
          ${instructions.contactInfo.whatsapp ? `<p style="margin: 5px 0;">WhatsApp: ${instructions.contactInfo.whatsapp}</p>` : ''}
          ${instructions.contactInfo.email ? `<p style="margin: 5px 0;">Email: ${instructions.contactInfo.email}</p>` : ''}
        </div>
        `
            : ''
        }

        <p><strong>Important:</strong> Please include your order number (${order.orderNumber}) when making payment so we can process it quickly.</p>

        <p>Once we receive and confirm your payment, we will issue your licenses and send you another email with download instructions.</p>

        <p>Best regards,<br>Kashi Kweyu</p>
      </div>
    `

    const emailConfig = await getEmailConfig()
    const result = await sendEmail(emailConfig, {
      to: order.customerEmail,
      subject: `Payment Instructions - Order ${order.orderNumber}`,
      html,
    })

    return result
  } catch (error: any) {
    console.error('Error sending payment instructions email:', error)
    return {
      success: false,
      error: error.message || 'Failed to send payment instructions email',
    }
  }
}

/**
 * Send license issued email (after order fulfillment)
 */
export async function sendLicenseIssuedEmail(orderId: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
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

    const licensesList = order.items
      .filter((item) => item.license)
      .map(
        (item) => `
        <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 10px 0;">
          <p style="margin: 0; font-weight: bold; color: #1f2937;">${item.productName}</p>
          <p style="margin: 5px 0; color: #6b7280;">License Type: ${item.licenseType}</p>
          <div style="background: #fff; padding: 10px; border-radius: 4px; margin-top: 10px;">
            <p style="margin: 0; font-size: 12px; color: #6b7280;">License Key:</p>
            <code style="font-size: 14px; color: #1f2937; font-weight: bold;">${item.license?.licenseKey}</code>
          </div>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || ''}/dashboard/downloads/${item.productSlug}"
             style="display: inline-block; margin-top: 10px; padding: 8px 16px; background: #3b82f6; color: #fff; text-decoration: none; border-radius: 6px; font-size: 14px;">
            Download Now
          </a>
        </div>
      `
      )
      .join('')

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #10b981;">Your Licenses Are Ready!</h1>
        <p>Hi ${order.customerName || 'there'},</p>
        <p>Great news! Your order <strong>${order.orderNumber}</strong> has been fulfilled and your licenses have been issued.</p>

        <h2 style="color: #1f2937; font-size: 18px;">Your Licenses:</h2>
        ${licensesList}

        <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; color: #1e3a8a;">
            <strong>Important:</strong> Keep your license keys safe. You can also access them anytime from your
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || ''}/dashboard/downloads" style="color: #3b82f6;">dashboard</a>.
          </p>
        </div>

        <p>You can download your products and manage your licenses from your dashboard. Each product has download limits to prevent abuse, so make sure to download to a safe location.</p>

        <p>If you have any questions or issues, please don't hesitate to contact support.</p>

        <p>Thank you for your purchase!</p>

        <p>Best regards,<br>Kashi Kweyu</p>
      </div>
    `

    const emailConfig = await getEmailConfig()
    const result = await sendEmail(emailConfig, {
      to: order.customerEmail,
      subject: `Your Licenses Are Ready - Order ${order.orderNumber}`,
      html,
    })

    return result
  } catch (error: any) {
    console.error('Error sending license issued email:', error)
    return {
      success: false,
      error: error.message || 'Failed to send license issued email',
    }
  }
}

/**
 * Send order cancelled email
 */
export async function sendOrderCancelledEmail(
  orderId: string,
  reason: string
): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      return {
        success: false,
        error: 'Order not found',
      }
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #ef4444;">Order Cancelled</h1>
        <p>Hi ${order.customerName || 'there'},</p>
        <p>Your order <strong>${order.orderNumber}</strong> has been cancelled.</p>

        <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; color: #991b1b;"><strong>Reason:</strong> ${reason}</p>
        </div>

        <p><strong>Order Total:</strong> ${formatPrice(Number(order.total), order.currency as SupportedCurrency)}</p>

        <p>If you have any questions about this cancellation, please contact support.</p>

        <p>Best regards,<br>Kashi Kweyu</p>
      </div>
    `

    const emailConfig = await getEmailConfig()
    const result = await sendEmail(emailConfig, {
      to: order.customerEmail,
      subject: `Order Cancelled - ${order.orderNumber}`,
      html,
    })

    return result
  } catch (error: any) {
    console.error('Error sending order cancelled email:', error)
    return {
      success: false,
      error: error.message || 'Failed to send order cancelled email',
    }
  }
}
