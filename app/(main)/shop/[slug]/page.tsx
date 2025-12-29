'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { LicenseSelector } from '@/components/features/shop/LicenseSelector'
import { PriceDisplay } from '@/components/features/shop/PriceDisplay'
import { ShoppingCart, Download, FileText, Package } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'
import { Spinner } from '@/components/ui/Spinner'

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const { data: session } = useSession()
  const router = useRouter()
  const { showToast } = useToast()

  const [product, setProduct] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLicense, setSelectedLicense] = useState<string>('PERSONAL')
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [params.slug])

  async function fetchProduct() {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/shop/products/${params.slug}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Product not found')
      }

      setProduct(data.product)
      // Set default license to first available option
      if (data.product.licenseOptions?.length > 0) {
        setSelectedLicense(data.product.licenseOptions[0].type)
      }
    } catch (error: any) {
      console.error('Error fetching product:', error)
      showToast(error.message || 'Failed to load product', 'error')
      router.push('/shop')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleAddToCart() {
    if (!session) {
      showToast('Please login to add items to cart', 'error')
      router.push(`/login?callbackUrl=/shop/${params.slug}`)
      return
    }

    try {
      setAddingToCart(true)
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          licenseType: selectedLicense,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add to cart')
      }

      showToast('Added to cart successfully!', 'success')
      router.push('/cart')
    } catch (error: any) {
      showToast(error.message || 'Failed to add to cart', 'error')
    } finally {
      setAddingToCart(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!product) {
    return null
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-muted border border-border">
              {product.thumbnailUrl ? (
                <Image
                  src={product.thumbnailUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-24 h-24 text-muted-foreground/20" />
                </div>
              )}
            </div>

            {/* Preview Images */}
            {product.previewImages && product.previewImages.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {product.previewImages.slice(0, 3).map((image: string, index: number) => (
                  <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-muted border border-border">
                    <Image
                      src={image}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                {product.category.replace(/_/g, ' ')}
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-4">
                {product.name}
              </h1>
              <p className="text-lg text-muted-foreground">
                {product.description}
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{product.downloadCount} downloads</span>
              </div>
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{product.purchaseCount} purchases</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">v{product.version}</span>
              </div>
            </div>

            {/* Price */}
            <div className="pt-6 border-t border-border">
              <PriceDisplay
                usdPrice={Number(product.prices.usd)}
                ugxPrice={Number(product.prices.ugx)}
                creditPrice={product.prices.credits}
              />
            </div>

            {/* License Selector */}
            {product.licenseOptions && product.licenseOptions.length > 0 && (
              <div className="pt-6 border-t border-border">
                <LicenseSelector
                  options={product.licenseOptions}
                  selected={selectedLicense}
                  onChange={setSelectedLicense}
                />
              </div>
            )}

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="w-full py-4 px-6 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addingToCart ? (
                <>
                  <Spinner size="sm" />
                  Adding to Cart...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </>
              )}
            </button>
          </div>
        </div>

        {/* Additional Info */}
        {(product.documentation || product.changelog) && (
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {product.documentation && (
              <div className="bg-card p-6 rounded-xl border border-border">
                <h2 className="text-2xl font-bold text-foreground mb-4">Documentation</h2>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  {product.documentation}
                </div>
              </div>
            )}

            {product.changelog && (
              <div className="bg-card p-6 rounded-xl border border-border">
                <h2 className="text-2xl font-bold text-foreground mb-4">Changelog</h2>
                <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
                  {product.changelog}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
