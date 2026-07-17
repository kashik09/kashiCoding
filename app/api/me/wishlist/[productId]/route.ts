import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { removeWishlistItem } from '@/lib/wishlist'

/**
 * DELETE /api/me/wishlist/[productId]
 * Remove product from wishlist
 */
export async function DELETE(
  req: Request,
  { params }: { params: { productId: string } }
) {
  const session = await getServerSession()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { productId } = params

    if (!productId || typeof productId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid productId' },
        { status: 400 }
      )
    }

    await removeWishlistItem(session.user.id, productId)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to remove from wishlist' },
      { status: 500 }
    )
  }
}
