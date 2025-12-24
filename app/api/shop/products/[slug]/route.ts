import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { convertPrice, isSupportedCurrency } from '@/lib/currency'
import type { SupportedCurrency } from '@/lib/currency'

/**
 * GET /api/shop/products/[slug]
 * Get detailed information about a specific product
 * Public endpoint - no authentication required
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const { searchParams } = new URL(request.url)
    const currency = searchParams.get('currency') || 'USD'

    // Validate currency
    const targetCurrency = isSupportedCurrency(currency) ? currency : 'USD'

    // Fetch product
    const product = await prisma.digitalProduct.findUnique({
      where: { slug },
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
        fileSize: true,
        fileType: true,
        thumbnailUrl: true,
        previewImages: true,
        personalLicense: true,
        commercialLicense: true,
        teamLicense: true,
        version: true,
        changelog: true,
        documentation: true,
        featured: true,
        downloadCount: true,
        purchaseCount: true,
        publishedAt: true,
        published: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Check if product is published (for public access)
    if (!product.published) {
      return NextResponse.json(
        { error: 'Product not available' },
        { status: 404 }
      )
    }

    // Calculate prices in different currencies
    const basePrice = Number(product.usdPrice || product.price)
    const prices = {
      usd: product.usdPrice || product.price,
      ugx: product.ugxPrice || convertPrice(basePrice, 'USD', 'UGX'),
      credits: product.creditPrice || null,
    }

    // Calculate display price in requested currency
    const displayPrice = convertPrice(basePrice, 'USD', targetCurrency as SupportedCurrency)

    // License options with pricing
    const licenseOptions = []
    if (product.personalLicense) {
      licenseOptions.push({
        type: 'PERSONAL',
        name: 'Personal License',
        description: 'For individual use on a single device',
        price: displayPrice,
        currency: targetCurrency,
        prices,
      })
    }
    if (product.commercialLicense) {
      licenseOptions.push({
        type: 'COMMERCIAL',
        name: 'Commercial License',
        description: 'For commercial projects and clients',
        price: displayPrice * 1.5, // Commercial typically costs more
        currency: targetCurrency,
        prices: {
          usd: Number(prices.usd) * 1.5,
          ugx: Number(prices.ugx) * 1.5,
          credits: prices.credits ? prices.credits * 1.5 : null,
        },
      })
    }
    if (product.teamLicense) {
      licenseOptions.push({
        type: 'TEAM',
        name: 'Team License',
        description: 'For teams up to 5 members',
        price: displayPrice * 3, // Team license costs more
        currency: targetCurrency,
        prices: {
          usd: Number(prices.usd) * 3,
          ugx: Number(prices.ugx) * 3,
          credits: prices.credits ? prices.credits * 3 : null,
        },
      })
    }

    return NextResponse.json({
      product: {
        ...product,
        displayPrice,
        displayCurrency: targetCurrency,
        prices,
        licenseOptions,
      },
    })
  } catch (error: any) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
