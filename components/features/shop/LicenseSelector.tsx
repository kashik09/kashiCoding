'use client'

import { Check } from 'lucide-react'
import { formatPriceShort } from '@/lib/currency'
import type { SupportedCurrency } from '@/lib/currency'

interface LicenseOption {
  type: 'PERSONAL' | 'COMMERCIAL' | 'TEAM'
  name: string
  description: string
  price: number
  currency: string
  prices: {
    usd: number | string
    ugx: number | string
    credits: number | null
  }
}

interface LicenseSelectorProps {
  options: LicenseOption[]
  selected: string
  onChange: (type: string) => void
  showCredits?: boolean
}

export function LicenseSelector({
  options,
  selected,
  onChange,
  showCredits = true,
}: LicenseSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-foreground mb-3">
        Select License Type
      </label>

      {options.map((option) => {
        const isSelected = selected === option.type
        const usdPrice = Number(option.prices.usd)

        return (
          <button
            key={option.type}
            onClick={() => onChange(option.type)}
            className={`
              w-full text-left p-4 rounded-lg border-2 transition-all
              ${isSelected
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50 bg-card'
              }
            `}
          >
            <div className="flex items-start gap-3">
              {/* Radio Circle */}
              <div className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0
                ${isSelected ? 'border-primary bg-primary' : 'border-border'}
              `}>
                {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-1">
                  <h4 className="font-semibold text-foreground">{option.name}</h4>
                  <div className="text-right">
                    <p className="font-bold text-foreground whitespace-nowrap">
                      {formatPriceShort(option.price, option.currency as SupportedCurrency)}
                    </p>
                    {showCredits && option.prices.credits && (
                      <p className="text-xs text-muted-foreground whitespace-nowrap">
                        or {option.prices.credits} credits
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
