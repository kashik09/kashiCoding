import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { getCartWithItems, addToCart, clearCart, calculateCartTotal } from '@/lib/cart'
import { LicenseType } from '@prisma/client'

/**
 * GET /api/cart
 * Get user's cart with all items
 * Requires authentication
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const currency = searchParams.get('currency') || 'USD'

    // Get cart with items
    const cart = await getCartWithItems(session.user.id)

    // Calculate totals
    const totals = await calculateCartTotal(session.user.id, currency)

    return NextResponse.json({
      cart: {
        ...cart,
        totals,
      },
    })
  } catch (error: any) {
    console.error('Error fetching cart:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/cart
 * Add item to cart
 * Requires authentication
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { productId, licenseType } = body

    // Validate input
    if (!productId || !licenseType) {
      return NextResponse.json(
        { error: 'Product ID and license type are required' },
        { status: 400 }
      )
    }

    // Validate license type
    if (!['PERSONAL', 'COMMERCIAL', 'TEAM'].includes(licenseType)) {
      return NextResponse.json(
        { error: 'Invalid license type' },
        { status: 400 }
      )
    }

    // Add to cart
    const result = await addToCart(
      session.user.id,
      productId,
      licenseType as LicenseType
    )

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      cart: result.cart,
    })
  } catch (error: any) {
    console.error('Error adding to cart:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to add item to cart' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/cart
 * Clear entire cart
 * Requires authentication
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const result = await clearCart(session.user.id)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Cart cleared successfully',
    })
  } catch (error: any) {
    console.error('Error clearing cart:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to clear cart' },
      { status: 500 }
    )
  }
}
