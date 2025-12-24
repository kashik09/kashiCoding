import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { convertPrice, isSupportedCurrency } from '@/lib/currency'
import type { SupportedCurrency } from '@/lib/currency'

/**
 * GET /api/shop/products
 * List all published digital products with filtering and search
 * Public endpoint - no authentication required
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Extract query parameters
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const featured = searchParams.get('featured')
    const sort = searchParams.get('sort') || 'newest'
    const currency = searchParams.get('currency') || 'USD'
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Validate currency
    const targetCurrency = isSupportedCurrency(currency) ? currency : 'USD'

    // Build where clause
    const where: any = {
      published: true,
    }

    if (category) {
      where.category = category
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ]
    }

    if (featured === 'true') {
      where.featured = true
    }

    // Price filtering (convert to USD for comparison)
    if (minPrice || maxPrice) {
      where.usdPrice = {}
      if (minPrice) {
        const minUSD = convertPrice(parseFloat(minPrice), targetCurrency as SupportedCurrency, 'USD')
        where.usdPrice.gte = minUSD
      }
      if (maxPrice) {
        const maxUSD = convertPrice(parseFloat(maxPrice), targetCurrency as SupportedCurrency, 'USD')
        where.usdPrice.lte = maxUSD
      }
    }

    // Build orderBy clause
    let orderBy: any = {}
    switch (sort) {
      case 'price-asc':
        orderBy = { usdPrice: 'asc' }
        break
      case 'price-desc':
        orderBy = { usdPrice: 'desc' }
        break
      case 'popular':
        orderBy = { purchaseCount: 'desc' }
        break
      case 'oldest':
        orderBy = { createdAt: 'asc' }
        break
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' }
        break
    }

    // Fetch products
    const [products, totalCount] = await Promise.all([
      prisma.digitalProduct.findMany({
        where,
        orderBy,
        take: limit,
        skip: offset,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          category: true,
          tags: true,
          price: true,
          currency: true,
          usdPrice: true,
          ugxPrice: true,
          creditPrice: true,
          thumbnailUrl: true,
          previewImages: true,
          personalLicense: true,
          commercialLicense: true,
          teamLicense: true,
          version: true,
          featured: true,
          downloadCount: true,
          purchaseCount: true,
          publishedAt: true,
          createdAt: true,
        },
      }),
      prisma.digitalProduct.count({ where }),
    ])

    // Transform products with currency conversion
    const transformedProducts = products.map((product) => {
      const basePrice = Number(product.usdPrice || product.price)
      const convertedPrice = convertPrice(basePrice, 'USD', targetCurrency as SupportedCurrency)

      return {
        ...product,
        price: product.usdPrice || product.price,
        usdPrice: product.usdPrice || product.price,
        ugxPrice: product.ugxPrice || convertPrice(basePrice, 'USD', 'UGX'),
        displayPrice: convertedPrice,
        displayCurrency: targetCurrency,
      }
    })

    return NextResponse.json({
      products: transformedProducts,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
      filters: {
        category,
        search,
        minPrice,
        maxPrice,
        featured,
        sort,
        currency: targetCurrency,
      },
    })
  } catch (error: any) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
