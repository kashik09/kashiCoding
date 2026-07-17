import { prisma } from '@/lib/prisma'

/**
 * Get wishlist items for a user with product details
 */
export async function getWishlistForUser(userId: string) {
  const items = await prisma.wishlistItem.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      product: {
        select: {
          id: true,
          slug: true,
          name: true,
          price: true,
          currency: true,
          usdPrice: true,
          ugxPrice: true,
          thumbnailUrl: true,
          category: true,
          published: true,
        },
      },
    },
  })

  return items
}

/**
 * Add product to wishlist (idempotent)
 */
export async function addWishlistItem(userId: string, productId: string) {
  // Verify product exists
  const product = await prisma.digitalProduct.findUnique({
    where: { id: productId },
    select: { id: true },
  })

  if (!product) {
    throw new Error('Product not found')
  }

  // Upsert to make it idempotent
  const item = await prisma.wishlistItem.upsert({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
    create: {
      userId,
      productId,
    },
    update: {},
  })

  return item
}

/**
 * Remove product from wishlist
 */
export async function removeWishlistItem(userId: string, productId: string) {
  await prisma.wishlistItem.deleteMany({
    where: {
      userId,
      productId,
    },
  })
}

/**
 * Check if product is in user's wishlist
 */
export async function isInWishlist(userId: string, productId: string) {
  const item = await prisma.wishlistItem.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  })

  return !!item
}
