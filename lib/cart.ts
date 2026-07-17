import { LicenseType } from '@prisma/client'
import { prisma } from '@/lib/prisma'

/**
 * Get or create a cart for a user
 */
export async function getOrCreateCart(userId: string) {
  try {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                usdPrice: true,
                ugxPrice: true,
                currency: true,
                thumbnailUrl: true,
                published: true,
              },
            },
          },
        },
      },
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  price: true,
                  usdPrice: true,
                  ugxPrice: true,
                  currency: true,
                  thumbnailUrl: true,
                  published: true,
                },
              },
            },
          },
        },
      })
    }

    return cart
  } catch (error: any) {
    console.error('Error getting or creating cart:', error)
    throw new Error(error.message || 'Failed to get or create cart')
  }
}

/**
 * Add an item to the cart
 */
export async function addToCart(
  userId: string,
  productId: string,
  licenseType: LicenseType
): Promise<{
  success: boolean
  error?: string
  cart?: any
}> {
  try {
    // Verify product exists and is published
    const product = await prisma.digitalProduct.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return {
        success: false,
        error: 'Product not found',
      }
    }

    if (!product.published) {
      return {
        success: false,
        error: 'Product is not available',
      }
    }

    // Verify license type is available for this product
    if (licenseType === 'PERSONAL' && !product.personalLicense) {
      return {
        success: false,
        error: 'Personal license is not available for this product',
      }
    }
    if (licenseType === 'COMMERCIAL' && !product.commercialLicense) {
      return {
        success: false,
        error: 'Commercial license is not available for this product',
      }
    }
    if (licenseType === 'TEAM' && !product.teamLicense) {
      return {
        success: false,
        error: 'Team license is not available for this product',
      }
    }

    // Get or create cart
    let cart = await getOrCreateCart(userId)

    // Check if item already exists in cart
    const existingItem = cart.items.find(
      (item) => item.productId === productId && item.licenseType === licenseType
    )

    if (existingItem) {
      // Update quantity (for digital products, quantity is always 1, but we keep the field for flexibility)
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: 1, // Digital products are typically single quantity
        },
      })
    } else {
      // Add new item to cart
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          licenseType,
          quantity: 1,
        },
      })
    }

    // Get updated cart
    cart = await getOrCreateCart(userId)

    return {
      success: true,
      cart,
    }
  } catch (error: any) {
    console.error('Error adding to cart:', error)
    return {
      success: false,
      error: error.message || 'Failed to add item to cart',
    }
  }
}

/**
 * Remove an item from the cart
 */
export async function removeFromCart(
  userId: string,
  itemId: string
): Promise<{
  success: boolean
  error?: string
  cart?: any
}> {
  try {
    // Get cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: true,
      },
    })

    if (!cart) {
      return {
        success: false,
        error: 'Cart not found',
      }
    }

    // Verify item belongs to this cart
    const item = cart.items.find((i) => i.id === itemId)
    if (!item) {
      return {
        success: false,
        error: 'Item not found in cart',
      }
    }

    // Remove item
    await prisma.cartItem.delete({
      where: { id: itemId },
    })

    // Get updated cart
    const updatedCart = await getOrCreateCart(userId)

    return {
      success: true,
      cart: updatedCart,
    }
  } catch (error: any) {
    console.error('Error removing from cart:', error)
    return {
      success: false,
      error: error.message || 'Failed to remove item from cart',
    }
  }
}

/**
 * Update item quantity in cart
 */
export async function updateCartItemQuantity(
  userId: string,
  itemId: string,
  quantity: number
): Promise<{
  success: boolean
  error?: string
  cart?: any
}> {
  try {
    if (quantity < 1) {
      return await removeFromCart(userId, itemId)
    }

    // Get cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: true,
      },
    })

    if (!cart) {
      return {
        success: false,
        error: 'Cart not found',
      }
    }

    // Verify item belongs to this cart
    const item = cart.items.find((i) => i.id === itemId)
    if (!item) {
      return {
        success: false,
        error: 'Item not found in cart',
      }
    }

    // Update quantity
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    })

    // Get updated cart
    const updatedCart = await getOrCreateCart(userId)

    return {
      success: true,
      cart: updatedCart,
    }
  } catch (error: any) {
    console.error('Error updating cart item quantity:', error)
    return {
      success: false,
      error: error.message || 'Failed to update cart item quantity',
    }
  }
}

/**
 * Clear all items from the cart
 */
export async function clearCart(userId: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId },
    })

    if (!cart) {
      return {
        success: true, // Cart doesn't exist, so it's already "clear"
      }
    }

    // Delete all cart items
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    })

    return {
      success: true,
    }
  } catch (error: any) {
    console.error('Error clearing cart:', error)
    return {
      success: false,
      error: error.message || 'Failed to clear cart',
    }
  }
}

/**
 * Calculate cart totals
 */
export async function calculateCartTotal(
  userId: string,
  currency: string = 'USD'
): Promise<{
  subtotal: number
  tax: number
  total: number
  itemCount: number
}> {
  try {
    const cart = await getOrCreateCart(userId)

    let subtotal = 0

    for (const item of cart.items) {
      if (!item.product) continue

      // Calculate price based on currency
      let itemPrice = 0
      if (currency === 'USD') {
        itemPrice = Number(item.product.usdPrice || item.product.price)
      } else if (currency === 'UGX') {
        itemPrice = Number(item.product.ugxPrice || item.product.price)
      } else {
        itemPrice = Number(item.product.price)
      }

      subtotal += itemPrice * item.quantity
    }

    // Tax calculation (0 for MVP, can be enhanced later)
    const tax = 0

    const total = subtotal + tax

    return {
      subtotal,
      tax,
      total,
      itemCount: cart.items.length,
    }
  } catch (error) {
    console.error('Error calculating cart total:', error)
    return {
      subtotal: 0,
      tax: 0,
      total: 0,
      itemCount: 0,
    }
  }
}

/**
 * Get cart with full item details
 */
export async function getCartWithItems(userId: string) {
  try {
    return await getOrCreateCart(userId)
  } catch (error) {
    console.error('Error getting cart with items:', error)
    throw error
  }
}

/**
 * Get cart item count
 */
export async function getCartItemCount(userId: string): Promise<number> {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: true,
      },
    })

    return cart?.items.length || 0
  } catch (error) {
    console.error('Error getting cart item count:', error)
    return 0
  }
}
