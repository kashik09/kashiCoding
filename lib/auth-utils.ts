export function normalizeEmail(value: unknown): string | null {
  if (typeof value !== 'string') return null

  const email = value.trim().toLowerCase()
  return email.length ? email : null
}

export function getNonEmptyString(value: unknown): string | null {
  if (typeof value !== 'string') return null

  const trimmed = value.trim()
  return trimmed.length ? trimmed : null
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_EMAIL_LENGTH = 254
export const MIN_PASSWORD_LENGTH = 12
export const MAX_PASSWORD_LENGTH = 72

// Allowed special characters - safe for most systems and easy to type
export const ALLOWED_SPECIAL_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?'
export const SPECIAL_CHAR_REGEX = /[!@#$%^&*()\-_=+\[\]{}|;:,.<>?]/

export interface PasswordRequirement {
  id: string
  label: string
  validator: (password: string) => boolean
}

export const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  {
    id: 'minLength',
    label: 'At least 12 characters',
    validator: (p) => p.length >= MIN_PASSWORD_LENGTH,
  },
  {
    id: 'uppercase',
    label: 'At least one uppercase letter (A-Z)',
    validator: (p) => /[A-Z]/.test(p),
  },
  {
    id: 'lowercase',
    label: 'At least one lowercase letter (a-z)',
    validator: (p) => /[a-z]/.test(p),
  },
  {
    id: 'number',
    label: 'At least one number (0-9)',
    validator: (p) => /[0-9]/.test(p),
  },
  {
    id: 'special',
    label: 'At least one special character (!@#$%^&*...)',
    validator: (p) => SPECIAL_CHAR_REGEX.test(p),
  },
]

export function getPasswordValidation(password: string): {
  requirement: PasswordRequirement
  met: boolean
}[] {
  return PASSWORD_REQUIREMENTS.map((requirement) => ({
    requirement,
    met: requirement.validator(password),
  }))
}

export function getPasswordStrength(password: string): number {
  if (!password) return 0

  const validations = getPasswordValidation(password)
  const metCount = validations.filter((v) => v.met).length
  const baseScore = (metCount / validations.length) * 70

  // Bonus points for extra length (up to 30%)
  const extraLength = Math.min(password.length - MIN_PASSWORD_LENGTH, 8)
  const lengthBonus = extraLength > 0 ? (extraLength / 8) * 30 : 0

  return Math.round(baseScore + lengthBonus)
}

export function getPasswordStrengthLabel(score: number): {
  label: string
  color: 'error' | 'warning' | 'info' | 'success'
} {
  if (score < 40) return { label: 'Weak', color: 'error' }
  if (score < 70) return { label: 'Fair', color: 'warning' }
  if (score < 90) return { label: 'Good', color: 'info' }
  return { label: 'Strong', color: 'success' }
}

export function getPasswordErrorMessage(password: string): string | null {
  if (!password) return 'Password is required'

  const validations = getPasswordValidation(password)
  const failed = validations.filter((v) => !v.met)

  if (failed.length === 0) return null

  return `Password must have: ${failed[0].requirement.label.toLowerCase()}`
}

export function isValidEmail(value: string): boolean {
  if (!value) return false
  if (value.length > MAX_EMAIL_LENGTH) return false
  return EMAIL_PATTERN.test(value)
}

export function isValidPassword(value: string): boolean {
  if (!value) return false
  if (value.length > MAX_PASSWORD_LENGTH) return false
  return PASSWORD_REQUIREMENTS.every((req) => req.validator(value))
}
