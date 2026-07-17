'use client'

import Image from 'next/image'
import Link from 'next/link'
import { X, Package } from 'lucide-react'
import { formatPriceShort } from '@/lib/currency'
import type { SupportedCurrency } from '@/lib/currency'
import { isLocalImageUrl, normalizePublicPath } from '@/lib/utils'

interface CartItemProps {
  item: {
    id: string
    productId: string
    licenseType: string
    quantity: number
    product: {
      name: string
      slug: string
      price: number
      thumbnailUrl?: string | null
    }
  }
  currency?: string
  onRemove: (itemId: string) => void
}

export function CartItem({ item, currency = 'USD', onRemove }: CartItemProps) {
  const price = Number(item.product.price)
  const thumbnailSrc = normalizePublicPath(item.product.thumbnailUrl)
  const isLocalThumbnail = isLocalImageUrl(thumbnailSrc)

  return (
    <div className="flex gap-4 p-4 bg-card rounded-lg border border-border">
      {/* Thumbnail */}
      <Link href={`/products/${item.product.slug}`} className="flex-shrink-0">
        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted border border-border">
          {thumbnailSrc ? (
            isLocalThumbnail ? (
              <Image
                src={thumbnailSrc}
                alt={item.product.name}
                fill
                sizes="96px"
                className="object-cover"
              />
            ) : (
              <img
                src={thumbnailSrc}
                alt={item.product.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-8 h-8 text-muted-foreground/20" />
            </div>
          )}
        </div>
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link href={`/products/${item.product.slug}`}>
          <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1">
            {item.product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mt-1">
          {item.licenseType} License
        </p>
        <p className="font-bold text-foreground mt-2">
          {formatPriceShort(price * item.quantity, currency as SupportedCurrency)}
        </p>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(item.id)}
        className="flex-shrink-0 p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors h-fit"
        aria-label="Remove item"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  )
}
