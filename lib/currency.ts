/**
 * Currency utilities for multi-currency support
 */

export type SupportedCurrency = 'USD' | 'UGX'

export const SUPPORTED_CURRENCIES: SupportedCurrency[] = ['USD', 'UGX']

export const DEFAULT_CURRENCY: SupportedCurrency = 'USD'

/**
 * Currency metadata
 */
export const CURRENCY_INFO: Record<
  SupportedCurrency,
  {
    symbol: string
    name: string
    decimals: number
    locale: string
  }
> = {
  USD: {
    symbol: '$',
    name: 'US Dollar',
    decimals: 2,
    locale: 'en-US',
  },
  UGX: {
    symbol: 'UGX',
    name: 'Ugandan Shilling',
    decimals: 0, // UGX doesn't use decimal places
    locale: 'en-UG',
  },
}

/**
 * Exchange rates (base currency: USD)
 * In production, these should be fetched from a real-time API
 * For MVP, we use static rates
 */
export const EXCHANGE_RATES: Record<SupportedCurrency, number> = {
  USD: 1,
  UGX: 3700, // 1 USD = 3700 UGX (update as needed)
}

/**
 * Convert price from one currency to another
 */
export function convertPrice(
  amount: number,
  from: SupportedCurrency,
  to: SupportedCurrency
): number {
  if (from === to) return amount

  // Convert to USD first (base currency)
  const amountInUSD = amount / EXCHANGE_RATES[from]

  // Convert from USD to target currency
  const convertedAmount = amountInUSD * EXCHANGE_RATES[to]

  // Round based on target currency decimals
  const decimals = CURRENCY_INFO[to].decimals
  return Math.round(convertedAmount * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

/**
 * Format price for display
 */
export function formatPrice(amount: number, currency: SupportedCurrency): string {
  const info = CURRENCY_INFO[currency]

  const formatted = new Intl.NumberFormat(info.locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: info.decimals,
    maximumFractionDigits: info.decimals,
  }).format(amount)

  return formatted
}

/**
 * Format price with currency symbol (shorter format)
 */
export function formatPriceShort(amount: number, currency: SupportedCurrency): string {
  const info = CURRENCY_INFO[currency]
  const rounded = Math.round(amount * Math.pow(10, info.decimals)) / Math.pow(10, info.decimals)

  if (currency === 'USD') {
    return `$${rounded.toLocaleString('en-US', {
      minimumFractionDigits: info.decimals,
      maximumFractionDigits: info.decimals,
    })}`
  }

  return `${info.symbol} ${rounded.toLocaleString(info.locale, {
    minimumFractionDigits: info.decimals,
    maximumFractionDigits: info.decimals,
  })}`
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currency: SupportedCurrency): string {
  return CURRENCY_INFO[currency].symbol
}

/**
 * Get currency name
 */
export function getCurrencyName(currency: SupportedCurrency): string {
  return CURRENCY_INFO[currency].name
}

/**
 * Check if a currency is supported
 */
export function isSupportedCurrency(currency: string): currency is SupportedCurrency {
  return SUPPORTED_CURRENCIES.includes(currency as SupportedCurrency)
}

/**
 * Get default currency (USD)
 */
export function getDefaultCurrency(): SupportedCurrency {
  return DEFAULT_CURRENCY
}

/**
 * Parse currency string to number
 */
export function parseCurrency(value: string): number {
  // Remove currency symbols and spaces
  const cleaned = value.replace(/[^0-9.-]/g, '')
  return parseFloat(cleaned) || 0
}

/**
 * Calculate price in multiple currencies
 */
export function getPriceInMultipleCurrencies(
  amount: number,
  baseCurrency: SupportedCurrency
): Record<SupportedCurrency, number> {
  const prices: Record<string, number> = {}

  for (const currency of SUPPORTED_CURRENCIES) {
    prices[currency] = convertPrice(amount, baseCurrency, currency)
  }

  return prices as Record<SupportedCurrency, number>
}

/**
 * Format price with both currencies (e.g., "$10 (UGX 37,000)")
 */
export function formatPriceWithConversion(
  amount: number,
  currency: SupportedCurrency,
  showCurrency?: SupportedCurrency
): string {
  const primaryPrice = formatPriceShort(amount, currency)

  if (!showCurrency || showCurrency === currency) {
    return primaryPrice
  }

  const convertedAmount = convertPrice(amount, currency, showCurrency)
  const secondaryPrice = formatPriceShort(convertedAmount, showCurrency)

  return `${primaryPrice} (${secondaryPrice})`
}

/**
 * Get exchange rate between two currencies
 */
export function getExchangeRate(
  from: SupportedCurrency,
  to: SupportedCurrency
): number {
  if (from === to) return 1
  return EXCHANGE_RATES[to] / EXCHANGE_RATES[from]
}
