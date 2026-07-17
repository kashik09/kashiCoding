/**
 * Service Availability Helper
 * Computes effective availability status based on:
 * - Leave dates
 * - Manual override
 * - Holiday rules
 */

export type AvailabilityStatus = 'AVAILABLE' | 'LIMITED' | 'UNAVAILABLE'

export interface AvailabilitySettings {
  availabilityStatus: string
  availabilityMessage: string | null
  leaveStart: Date | null
  leaveEnd: Date | null
  manualOverride: boolean
}

export interface EffectiveAvailability {
  status: AvailabilityStatus
  message: string | null
}

/**
 * Check if a date falls within a leave period
 */
function isOnLeave(
  date: Date,
  leaveStart: Date | null,
  leaveEnd: Date | null
): boolean {
  if (!leaveStart || !leaveEnd) return false
  const current = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const start = new Date(
    leaveStart.getFullYear(),
    leaveStart.getMonth(),
    leaveStart.getDate()
  )
  const end = new Date(
    leaveEnd.getFullYear(),
    leaveEnd.getMonth(),
    leaveEnd.getDate()
  )
  return current >= start && current <= end
}

/**
 * Check if a date falls on a holiday
 */
function isHoliday(date: Date): boolean {
  const month = date.getMonth() + 1 // 1-indexed
  const day = date.getDate()

  // Christmas Day (Dec 25)
  if (month === 12 && day === 25) return true

  // New Year's Day (Jan 1)
  if (month === 1 && day === 1) return true

  // Labour Day (May 1)
  if (month === 5 && day === 1) return true

  // Christmas/New Year period (Dec 24 - Jan 2)
  if (month === 12 && day >= 24) return true
  if (month === 1 && day <= 2) return true

  return false
}

/**
 * Limit status to at most LIMITED
 * If current status is AVAILABLE, return LIMITED
 * If current status is LIMITED or UNAVAILABLE, keep it
 */
function limitStatus(status: string): AvailabilityStatus {
  if (status === 'UNAVAILABLE') return 'UNAVAILABLE'
  return 'LIMITED'
}

/**
 * Format a date for display (e.g., "Jan 15")
 */
function formatDate(date: Date): string {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  return `${months[date.getMonth()]} ${date.getDate()}`
}

/**
 * Calculate effective availability status
 */
export function calculateEffectiveAvailability(
  settings: AvailabilitySettings,
  currentDate: Date = new Date()
): EffectiveAvailability {
  const { availabilityStatus, availabilityMessage, leaveStart, leaveEnd, manualOverride } =
    settings

  // Rule 1: Check if on leave
  if (isOnLeave(currentDate, leaveStart, leaveEnd)) {
    const leaveMessage = leaveEnd
      ? `On leave until ${formatDate(leaveEnd)}`
      : 'Currently on leave'
    const finalMessage = availabilityMessage
      ? `${leaveMessage}. ${availabilityMessage}`
      : leaveMessage

    return {
      status: 'UNAVAILABLE',
      message: finalMessage,
    }
  }

  // Rule 2: Check manual override
  if (manualOverride) {
    return {
      status: availabilityStatus as AvailabilityStatus,
      message: availabilityMessage,
    }
  }

  // Rule 3: Check for holidays
  if (isHoliday(currentDate)) {
    const limitedStatus = limitStatus(availabilityStatus)
    const holidayNote =
      limitedStatus === 'LIMITED' && availabilityStatus === 'AVAILABLE'
        ? 'Holiday period - limited availability'
        : null
    const finalMessage = holidayNote
      ? availabilityMessage
        ? `${holidayNote}. ${availabilityMessage}`
        : holidayNote
      : availabilityMessage

    return {
      status: limitedStatus,
      message: finalMessage,
    }
  }

  // Rule 4: No special conditions - use admin status
  return {
    status: availabilityStatus as AvailabilityStatus,
    message: availabilityMessage,
  }
}
