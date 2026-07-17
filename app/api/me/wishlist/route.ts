import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { getWishlistForUser, addWishlistItem } from '@/lib/wishlist'

/**
 * GET /api/me/wishlist
 * Get user's wishlist items
 */
export async function GET() {
  const session = await getServerSession()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const items = await getWishlistForUser(session.user.id)

    return NextResponse.json({
      ok: true,
      items: items.map((item) => ({
        id: item.id,
        productId: item.product.id,
        slug: item.product.slug,
        name: item.product.name,
        price: item.product.price,
        currency: item.product.currency,
        usdPrice: item.product.usdPrice,
        ugxPrice: item.product.ugxPrice,
        thumbnailUrl: item.product.thumbnailUrl,
        category: item.product.category,
        published: item.product.published,
        createdAt: item.createdAt,
      })),
    })
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/me/wishlist
 * Add product to wishlist
 */
export async function POST(req: Request) {
  const session = await getServerSession()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json().catch(() => null)

    if (!body || !body.productId || typeof body.productId !== 'string') {
      return NextResponse.json(
        { error: 'productId is required' },
        { status: 400 }
      )
    }

    await addWishlistItem(session.user.id, body.productId)

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('Error adding to wishlist:', error)

    if (error.message === 'Product not found') {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to add to wishlist' },
      { status: 500 }
    )
  }
}
