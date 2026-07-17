'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useToast } from '@/components/ui/Toast'
import { LicenseSelector } from '@/components/features/shop/LicenseSelector'
import { Spinner } from '@/components/ui/Spinner'

interface LicenseOption {
  type: 'PERSONAL' | 'COMMERCIAL' | 'TEAM'
  name: string
  description: string
  price: number
  currency: string
  prices: {
    usd: number | string
    ugx: number | string
  }
}

interface ProductDetailClientProps {
  productId: string
  productName: string
  productSlug: string
  licenseOptions: LicenseOption[]
  defaultLicense: 'PERSONAL' | 'COMMERCIAL' | 'TEAM'
}

export function ProductDetailClient({
  productId,
  productName,
  productSlug,
  licenseOptions,
  defaultLicense,
}: ProductDetailClientProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const { showToast } = useToast()
  const [selectedLicense, setSelectedLicense] = useState(defaultLicense)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addToCart = async (redirect: boolean) => {
    if (!session) {
      router.push(`/login?callbackUrl=/products/${encodeURIComponent(productSlug)}`)
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          licenseType: selectedLicense,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add to cart')
      }

      showToast(`${productName} added to cart`, 'success')
      if (redirect) {
        router.push('/cart')
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to add to cart', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <LicenseSelector
        options={licenseOptions}
        selected={selectedLicense}
        onChange={(value) => setSelectedLicense(value as LicenseOption['type'])}
      />

      <div className="grid grid-cols-1 gap-3">
        <button
          type="button"
          onClick={() => addToCart(false)}
          disabled={isSubmitting}
          className="w-full py-3 px-6 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Spinner size="sm" />
              Adding...
            </>
          ) : (
            'Add to cart'
          )}
        </button>
        <button
          type="button"
          onClick={() => addToCart(true)}
          disabled={isSubmitting}
          className="w-full py-3 px-6 rounded-lg border border-border text-foreground font-semibold hover:border-primary/60 transition disabled:opacity-60"
        >
          Buy now
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        Licenses are issued after payment confirmation. Download limits and audit logging apply.
      </p>
    </div>
  )
}
