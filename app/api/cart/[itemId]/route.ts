import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { removeFromCart, updateCartItemQuantity } from '@/lib/cart'

/**
 * PATCH /api/cart/[itemId]
 * Update cart item quantity
 * Requires authentication
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { itemId } = params
    const body = await request.json()
    const { quantity } = body

    // Validate quantity
    if (typeof quantity !== 'number' || quantity < 0) {
      return NextResponse.json(
        { error: 'Invalid quantity' },
        { status: 400 }
      )
    }

    // Update quantity
    const result = await updateCartItemQuantity(
      session.user.id,
      itemId,
      quantity
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
    console.error('Error updating cart item:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update cart item' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/cart/[itemId]
 * Remove item from cart
 * Requires authentication
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { itemId } = params

    // Remove item
    const result = await removeFromCart(session.user.id, itemId)

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
    console.error('Error removing cart item:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to remove cart item' },
      { status: 500 }
    )
  }
}
