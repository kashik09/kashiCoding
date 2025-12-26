import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string): string {
  // TODO: Implement date formatting
  return new Date(date).toLocaleDateString()
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

/**
 * Generate slug from string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}

/**
 * Normalize stored file paths into public-facing URLs.
 */
export function normalizePublicPath(input?: string | null): string | null {
  if (!input) return null

  if (input.startsWith('http://') || input.startsWith('https://')) {
    return input
  }

  const normalized = input.replace(/\\/g, '/')

  if (normalized.includes('/public/')) {
    return normalized.slice(normalized.indexOf('/public/') + '/public'.length)
  }

  if (normalized.includes('/uploads/')) {
    return normalized.slice(normalized.indexOf('/uploads/'))
  }

  if (normalized.includes('/projects/')) {
    return normalized.slice(normalized.indexOf('/projects/'))
  }

  if (normalized.startsWith('public/')) {
    return `/${normalized.slice('public/'.length)}`
  }

  if (normalized.startsWith('/')) return normalized

  return `/${normalized}`
}
