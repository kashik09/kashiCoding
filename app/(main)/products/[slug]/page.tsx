import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { prettyCategory } from '@/lib/product-ui'
import { ProductDetailClient } from '@/components/features/shop/ProductDetailClient'
import { isLocalImageUrl, normalizePublicPath } from '@/lib/utils'

function toNumber(value: any): number {
  if (value === null || value === undefined) return 0
  return Number(value)
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const product = await prisma.digitalProduct.findFirst({
    where: { slug: params.slug, published: true },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      category: true,
      tags: true,
      price: true,
      usdPrice: true,
      ugxPrice: true,
      creditPrice: true,
      thumbnailUrl: true,
      previewImages: true,
      personalLicense: true,
      commercialLicense: true,
      teamLicense: true,
      version: true,
      fileSize: true,
      fileType: true,
    },
  })

  if (!product) {
    notFound()
  }

  const displayName =
    product.slug === 'nextjs-portfolio-starter' ? 'Portfolio Starter' : product.name
  const usdPrice = toNumber(product.usdPrice || product.price)
  const ugxPrice = product.ugxPrice ? toNumber(product.ugxPrice) : usdPrice * 3700
  const previewSrc = normalizePublicPath(product.previewImages?.[0] || product.thumbnailUrl)
  const isLocalPreview = previewSrc ? isLocalImageUrl(previewSrc) : false

  const licenseOptions = [
    product.personalLicense && {
      type: 'PERSONAL' as const,
      name: 'Personal',
      description: 'Single user license for personal or limited commercial work.',
      price: usdPrice,
      currency: 'USD',
      prices: {
        usd: usdPrice,
        ugx: ugxPrice,
        credits: null,
      },
    },
    product.commercialLicense && {
      type: 'COMMERCIAL' as const,
      name: 'Commercial',
      description: 'Single user license for client or business use.',
      price: usdPrice,
      currency: 'USD',
      prices: {
        usd: usdPrice,
        ugx: ugxPrice,
        credits: null,
      },
    },
    product.teamLicense && {
      type: 'TEAM' as const,
      name: 'Team',
      description: '2-5 users with assigned seats and internal sharing.',
      price: usdPrice,
      currency: 'USD',
      prices: {
        usd: usdPrice,
        ugx: ugxPrice,
        credits: null,
      },
    },
  ].filter(Boolean) as Array<{
    type: 'PERSONAL' | 'COMMERCIAL' | 'TEAM'
    name: string
    description: string
    price: number
    currency: string
    prices: { usd: number; ugx: number; credits: number | null }
  }>

  const defaultLicense = licenseOptions[0]?.type ?? 'PERSONAL'

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 space-y-12">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 space-y-6">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
              {prettyCategory(product.category)}
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              {displayName}
            </h1>
            <p className="text-lg text-muted-foreground">{product.description}</p>

            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full border border-border text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
              <div className="bg-card border border-border rounded-xl p-4">
                <p className="uppercase tracking-wide text-xs">Version</p>
                <p className="text-foreground font-semibold">{product.version}</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4">
                <p className="uppercase tracking-wide text-xs">File Type</p>
                <p className="text-foreground font-semibold">{product.fileType}</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4">
                <p className="uppercase tracking-wide text-xs">File Size</p>
                <p className="text-foreground font-semibold">
                  {(product.fileSize / (1024 * 1024)).toFixed(1)} MB
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4">
                <p className="uppercase tracking-wide text-xs">License</p>
                <p className="text-foreground font-semibold">One-time purchase</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-bold text-foreground">License boundaries</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Non-transferable, no resale or redistribution.</li>
                <li>One person or one team per license tier.</li>
                <li>Download limits and device limits are enforced.</li>
                <li>Enterprise use requires a custom agreement.</li>
                <li>No refunds after purchase, except where required by law.</li>
              </ul>
              <Link href="/legal/terms" className="text-sm text-primary hover:underline">
                Read full terms
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-[420px] space-y-6">
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="relative aspect-video bg-muted">
                {previewSrc ? (
                  isLocalPreview ? (
                    <Image
                      src={previewSrc}
                      alt={displayName}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 420px"
                    />
                  ) : (
                    <img
                      src={previewSrc}
                      alt={displayName}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  )
                ) : null}
              </div>
              <div className="p-6 space-y-4">
                <ProductDetailClient
                  productId={product.id}
                  productName={displayName}
                  productSlug={product.slug}
                  licenseOptions={licenseOptions}
                  defaultLicense={defaultLicense}
                />
              </div>
            </div>

            <div className="bg-muted/40 border border-border rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">What happens after purchase?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Payment is confirmed manually before license issuance.</li>
                <li>Licenses are tied to your account and tracked in audit logs.</li>
                <li>Abuse or chargebacks can trigger suspension.</li>
              </ul>
              <Link href="/contact" className="text-sm text-primary hover:underline">
                Questions? Contact support.
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
