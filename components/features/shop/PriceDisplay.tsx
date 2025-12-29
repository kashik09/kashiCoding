'use client'

import { useState } from 'react'
import { formatPriceShort } from '@/lib/currency'
import type { SupportedCurrency } from '@/lib/currency'

interface PriceDisplayProps {
  usdPrice: number
  ugxPrice?: number
  creditPrice?: number | null
  showCurrencyToggle?: boolean
  showCredits?: boolean
  className?: string
}

export function PriceDisplay({
  usdPrice,
  ugxPrice,
  creditPrice,
  showCurrencyToggle = true,
  showCredits = true,
  className = '',
}: PriceDisplayProps) {
  const [currency, setCurrency] = useState<SupportedCurrency>('USD')

  const price = currency === 'USD' ? usdPrice : (ugxPrice || usdPrice * 3700)

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-bold text-foreground">
          {formatPriceShort(price, currency)}
        </span>
        {showCurrencyToggle && (
          <button
            onClick={() => setCurrency(currency === 'USD' ? 'UGX' : 'USD')}
            className="text-sm text-muted-foreground hover:text-foreground underline"
          >
            Show in {currency === 'USD' ? 'UGX' : 'USD'}
          </button>
        )}
      </div>

      {showCredits && creditPrice && creditPrice > 0 && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">or</span>
          <span className="font-semibold text-primary">{creditPrice} Credits</span>
          <span className="text-muted-foreground text-xs">(with membership)</span>
        </div>
      )}

      {currency !== 'USD' && (
        <p className="text-xs text-muted-foreground">
          ≈ {formatPriceShort(usdPrice, 'USD')}
        </p>
      )}
    </div>
  )
}
