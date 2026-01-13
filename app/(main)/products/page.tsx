import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ProductGrid } from '@/components/features/shop/ProductGrid'

const PRIMARY_PRODUCT_SLUGS = new Set(['portfolio-starter', 'nextjs-portfolio-starter'])

function toNumber(value: any): number {
  if (value === null || value === undefined) return 0
  return Number(value)
}

export default async function ProductsPage() {
  let products: Array<any> = []

  try {
    products = await prisma.digitalProduct.findMany({
      where: { published: true },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        category: true,
        price: true,
        usdPrice: true,
        ugxPrice: true,
        thumbnailUrl: true,
        featured: true,
        downloadCount: true,
        purchaseCount: true,
      },
    })
  } catch (error) {
    console.error('Failed to load products:', error)
  }

  const normalized = products.map((product) => {
    const isPrimary = PRIMARY_PRODUCT_SLUGS.has(product.slug)
    return {
      ...product,
      name: isPrimary ? 'Portfolio Starter' : product.name,
      price: toNumber(product.price),
      usdPrice: toNumber(product.usdPrice || product.price),
      ugxPrice: product.ugxPrice ? toNumber(product.ugxPrice) : undefined,
    }
  })

  const primaryProduct = normalized.find(
    (product) => PRIMARY_PRODUCT_SLUGS.has(product.slug) || product.name === 'Portfolio Starter'
  )

  const otherProducts = normalized.filter((product) => product.id !== primaryProduct?.id)

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 space-y-16">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Digital Products</p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Portfolio Starter, plus a small set of focused builds
            </h1>
            <p className="text-lg text-muted-foreground">
              One-time purchases, delivered as digital downloads. Every product is licensed, non-transferable, and protected by download limits and abuse checks.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={primaryProduct ? `/products/${primaryProduct.slug}` : '/contact'}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition"
              >
                View Portfolio Starter
              </Link>
              <Link
                href="/services"
                className="px-6 py-3 border border-border rounded-lg text-foreground hover:border-primary/60 transition"
              >
                Need custom help?
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              Licenses are issued after payment confirmation. No refunds after purchase, except where required by law.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 space-y-4">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Featured</p>
            <h2 className="text-3xl font-bold text-foreground">Portfolio Starter</h2>
            <p className="text-muted-foreground">
              {primaryProduct?.description ||
                'A clean, production-ready portfolio system with an admin CMS, licensing, downloads, and a polished UI. Always available.'}
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>One-time purchase, licensed use</li>
              <li>Personal, Commercial, and Team license options</li>
              <li>Download limits enforced with audit logging</li>
            </ul>
            <Link
              href={primaryProduct ? `/products/${primaryProduct.slug}` : '/contact'}
              className="inline-flex items-center justify-center px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition"
            >
              See details
            </Link>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Other products</h2>
              <p className="text-muted-foreground">
                A small catalog of tools, templates, and systems. All one-time purchase licenses.
              </p>
            </div>
            <Link href="/pricing" className="text-sm text-primary hover:underline">
              Compare service plans
            </Link>
          </div>
          <ProductGrid products={otherProducts.length > 0 ? otherProducts : normalized} />
        </section>
      </div>
    </div>
  )
}
