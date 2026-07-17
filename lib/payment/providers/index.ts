import { PaymentProvider } from './base'
import { ManualPaymentProvider } from './manual'

/**
 * Payment Provider Registry
 * Add new payment providers here as they are implemented
 */

// Initialize providers
const manualProvider = new ManualPaymentProvider()

// Future providers (uncomment when implemented)
// import { StripePaymentProvider } from './stripe'
// const stripeProvider = new StripePaymentProvider()

// import { PayPalPaymentProvider } from './paypal'
// const paypalProvider = new PayPalPaymentProvider()

/**
 * Registry of all payment providers
 */
export const paymentProviders: Record<string, PaymentProvider> = {
  MANUAL: manualProvider,
  // STRIPE: stripeProvider, // Uncomment when Stripe is implemented
  // PAYPAL: paypalProvider, // Uncomment when PayPal is implemented
}

/**
 * Get all available (enabled) payment providers
 */
export function getAvailableProviders(): PaymentProvider[] {
  return Object.values(paymentProviders).filter((provider) => provider.enabled)
}

/**
 * Get a specific payment provider by ID
 */
export function getProvider(providerId: string): PaymentProvider | null {
  const provider = paymentProviders[providerId.toUpperCase()]
  return provider && provider.enabled ? provider : null
}

/**
 * Check if a payment provider is available
 */
export function isProviderAvailable(providerId: string): boolean {
  const provider = getProvider(providerId)
  return provider !== null && provider.enabled
}

/**
 * Get payment provider by ID or throw error if not found
 */
export function getProviderOrThrow(providerId: string): PaymentProvider {
  const provider = getProvider(providerId)
  if (!provider) {
    throw new Error(`Payment provider '${providerId}' is not available`)
  }
  return provider
}
