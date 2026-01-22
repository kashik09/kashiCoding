'use client'

import { useMemo } from 'react'
import { Check, X, Circle } from 'lucide-react'
import {
  getPasswordValidation,
  getPasswordStrength,
  getPasswordStrengthLabel,
} from '@/lib/auth-utils'

interface PasswordStrengthMeterProps {
  password: string
  showRequirements?: boolean
  className?: string
}

export function PasswordStrengthMeter({
  password,
  showRequirements = true,
  className = '',
}: PasswordStrengthMeterProps) {
  const validations = useMemo(() => getPasswordValidation(password), [password])
  const strength = useMemo(() => getPasswordStrength(password), [password])
  const { label, color } = useMemo(
    () => getPasswordStrengthLabel(strength),
    [strength]
  )

  const colorClasses: Record<string, string> = {
    error: 'bg-destructive',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
    success: 'bg-green-500',
  }

  const textColorClasses: Record<string, string> = {
    error: 'text-destructive',
    warning: 'text-yellow-500',
    info: 'text-blue-500',
    success: 'text-green-500',
  }

  if (!password) {
    return null
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Password strength</span>
          <span className={`font-medium ${textColorClasses[color]}`}>
            {label}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted/30 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ease-out rounded-full ${colorClasses[color]}`}
            style={{ width: `${strength}%` }}
          />
        </div>
      </div>

      {showRequirements && (
        <div className="space-y-1.5">
          {validations.map(({ requirement, met }) => (
            <div
              key={requirement.id}
              className={`flex items-center gap-2 text-xs transition-colors duration-200 ${
                met ? 'text-green-500' : 'text-muted-foreground'
              }`}
            >
              {met ? (
                <Check size={14} className="text-green-500 flex-shrink-0" />
              ) : password.length > 0 ? (
                <X size={14} className="text-muted-foreground/50 flex-shrink-0" />
              ) : (
                <Circle
                  size={14}
                  className="text-muted-foreground/30 flex-shrink-0"
                />
              )}
              <span className={met ? 'line-through opacity-60' : ''}>
                {requirement.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
