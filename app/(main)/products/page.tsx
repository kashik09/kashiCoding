'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ProductGrid } from '@/components/shop/ProductGrid'
import { Search } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

export default function ProductsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { showToast } = useToast()

  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('newest')
  const [currency, setCurrency] = useState('USD')

  useEffect(() => {
    fetchProducts()
  }, [search, category, sort, currency])

  async function fetchProducts() {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (category) params.append('category', category)
      if (sort) params.append('sort', sort)
      if (currency) params.append('currency', currency)

      const response = await fetch(`/api/shop/products?${params.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch products')
      }

      setProducts(data.products || [])
    } catch (error: any) {
      console.error('Error fetching products:', error)
      showToast(error.message || 'Failed to load products', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleAddToCart(productId: string) {
    if (!session) {
      showToast('Please login to add items to cart', 'error')
      router.push('/login?callbackUrl=/products')
      return
    }

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, licenseType: 'PERSONAL' }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add to cart')
      }

      showToast('Added to cart!', 'success')
    } catch (error: any) {
      showToast(error.message || 'Failed to add to cart', 'error')
    }
  }

  return (
    <div className="py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-foreground">products</h1>
        <p className="text-muted-foreground max-w-2xl">
          templates, themes, and tools i've built and packaged for reuse. these exist because i needed them first.
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">all categories</option>
            <option value="TEMPLATE">templates</option>
            <option value="THEME">themes</option>
            <option value="UI_KIT">ui kits</option>
            <option value="CODE_SNIPPET">code snippets</option>
            <option value="ASSET">assets</option>
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="newest">newest</option>
            <option value="oldest">oldest</option>
            <option value="price-asc">price: low to high</option>
            <option value="price-desc">price: high to low</option>
            <option value="popular">popular</option>
          </select>

          {/* Currency */}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="USD">usd ($)</option>
            <option value="UGX">ugx</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <ProductGrid
        products={products}
        onAddToCart={handleAddToCart}
        isLoading={isLoading}
      />
    </div>
  )
}
