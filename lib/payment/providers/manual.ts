import { PaymentIntent, PaymentInstructions, PaymentProvider, PaymentVerification } from './base'

/**
 * Manual Payment Provider
 * For bank transfers, WhatsApp payments, and other manual payment methods
 */
export class ManualPaymentProvider implements PaymentProvider {
  id = 'MANUAL'
  name = 'Manual Payment / WhatsApp'
  enabled = true
  description = 'Pay via bank transfer or WhatsApp. We will confirm your payment manually.'

  async createPaymentIntent(params: {
    orderId: string
    orderNumber: string
    amount: number
    currency: string
    customerEmail: string
    customerName?: string
  }): Promise<PaymentIntent> {
    // For manual payments, we just return pending status with instructions
    return {
      id: `manual_${params.orderId}`,
      status: 'pending',
      amount: params.amount,
      currency: params.currency,
      instructions: this.getInstructions({
        orderNumber: params.orderNumber,
        amount: params.amount,
        currency: params.currency,
      }),
      metadata: {
        orderId: params.orderId,
        orderNumber: params.orderNumber,
        customerEmail: params.customerEmail,
        customerName: params.customerName,
      },
    }
  }

  async verifyPayment(transactionId: string): Promise<PaymentVerification> {
    // Manual payments cannot be automatically verified
    // Admin must manually confirm payment via the admin panel
    return {
      verified: false,
      status: 'pending',
      transactionId,
      error: 'Manual payment verification requires admin confirmation',
    }
  }

  getInstructions(params: {
    orderNumber: string
    amount: number
    currency: string
  }): PaymentInstructions {
    const whatsappNumber = process.env.MANUAL_PAYMENT_WHATSAPP || '+256...'
    const customInstructions = process.env.MANUAL_PAYMENT_INSTRUCTIONS

    const steps = [
      `Contact us via WhatsApp at ${whatsappNumber}`,
      `Reference your order number: ${params.orderNumber}`,
      `Amount to pay: ${params.currency} ${params.amount.toLocaleString()}`,
      'Send proof of payment (screenshot/receipt)',
      'We will confirm your payment and activate your licenses once payment is confirmed',
    ]

    if (customInstructions) {
      steps.push(customInstructions)
    }

    return {
      method: 'manual',
      steps,
      contactInfo: {
        whatsapp: whatsappNumber,
        email: process.env.EMAIL_ORDER_FROM || 'orders@yourdomain.com',
      },
      additionalInfo: `Your order number is ${params.orderNumber}. Please keep this for reference.`,
    }
  }
}
