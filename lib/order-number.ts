import { prisma } from '@/lib/prisma'

/**
 * Generate a unique order number
 * Format: ORD-YYYYMMDD-XXXXX
 * Example: ORD-20251224-A1B2C
 */
export async function generateOrderNumber(): Promise<string> {
  const prefix = process.env.ORDER_NUMBER_PREFIX || 'ORD'

  // Get current date in YYYYMMDD format
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const datePart = `${year}${month}${day}`

  // Generate random alphanumeric suffix (5 characters)
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Removed ambiguous characters (0, O, 1, I)
  let suffix = ''
  for (let i = 0; i < 5; i++) {
    suffix += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  const orderNumber = `${prefix}-${datePart}-${suffix}`

  // Check if order number already exists (very unlikely, but let's be safe)
  const existingOrder = await prisma.order.findUnique({
    where: { orderNumber },
  })

  if (existingOrder) {
    // Recursively generate a new one
    return generateOrderNumber()
  }

  return orderNumber
}

/**
 * Parse order number to extract date
 * Returns null if order number is invalid
 */
export function parseOrderNumber(orderNumber: string): {
  prefix: string
  date: Date | null
  suffix: string
} | null {
  const parts = orderNumber.split('-')

  if (parts.length !== 3) {
    return null
  }

  const [prefix, datePart, suffix] = parts

  // Parse date (YYYYMMDD)
  if (datePart.length !== 8) {
    return null
  }

  const year = parseInt(datePart.substring(0, 4), 10)
  const month = parseInt(datePart.substring(4, 6), 10) - 1 // Month is 0-indexed
  const day = parseInt(datePart.substring(6, 8), 10)

  const date = new Date(year, month, day)

  // Validate date
  if (isNaN(date.getTime())) {
    return null
  }

  return {
    prefix,
    date,
    suffix,
  }
}

/**
 * Validate order number format
 */
export function isValidOrderNumber(orderNumber: string): boolean {
  return parseOrderNumber(orderNumber) !== null
}

/**
 * Get order creation date from order number
 */
export function getOrderDateFromNumber(orderNumber: string): Date | null {
  const parsed = parseOrderNumber(orderNumber)
  return parsed?.date || null
}
