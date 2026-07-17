/**
 * Payment Provider Base Interface
 * All payment providers must implement this interface
 */

export interface PaymentIntent {
  id: string
  status: 'pending' | 'succeeded' | 'failed'
  amount: number
  currency: string
  clientSecret?: string
  instructions?: PaymentInstructions
  metadata?: Record<string, any>
}

export interface PaymentInstructions {
  method: string
  steps: string[]
  contactInfo?: {
    whatsapp?: string
    email?: string
    phone?: string
  }
  additionalInfo?: string
}

export interface WebhookResult {
  verified: boolean
  paymentStatus: 'completed' | 'failed' | 'pending'
  transactionId?: string
  error?: string
}

export interface PaymentVerification {
  verified: boolean
  status: 'completed' | 'failed' | 'pending'
  transactionId?: string
  amount?: number
  currency?: string
  error?: string
}

export interface PaymentProvider {
  /**
   * Unique identifier for the payment provider
   */
  id: string

  /**
   * Display name for the payment provider
   */
  name: string

  /**
   * Whether this provider is currently enabled
   */
  enabled: boolean

  /**
   * Description of the payment provider
   */
  description?: string

  /**
   * Create a payment intent for an order
   */
  createPaymentIntent(params: {
    orderId: string
    orderNumber: string
    amount: number
    currency: string
    customerEmail: string
    customerName?: string
    metadata?: Record<string, any>
  }): Promise<PaymentIntent>

  /**
   * Handle webhook from payment provider
   * Optional - only needed for providers with webhooks
   */
  handleWebhook?(request: Request): Promise<WebhookResult>

  /**
   * Verify a payment by transaction ID
   */
  verifyPayment(transactionId: string): Promise<PaymentVerification>

  /**
   * Get payment instructions for manual payment methods
   * Optional - only needed for manual payment providers
   */
  getInstructions?(params: {
    orderNumber: string
    amount: number
    currency: string
  }): PaymentInstructions
}

/**
 * Base class for payment providers
 * Providers can extend this class for common functionality
 */
export abstract class BasePaymentProvider implements PaymentProvider {
  abstract id: string
  abstract name: string
  abstract enabled: boolean
  description?: string

  abstract createPaymentIntent(params: {
    orderId: string
    orderNumber: string
    amount: number
    currency: string
    customerEmail: string
    customerName?: string
    metadata?: Record<string, any>
  }): Promise<PaymentIntent>

  abstract verifyPayment(transactionId: string): Promise<PaymentVerification>

  handleWebhook?(request: Request): Promise<WebhookResult>

  getInstructions?(params: {
    orderNumber: string
    amount: number
    currency: string
  }): PaymentInstructions
}
