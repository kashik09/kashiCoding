// Unified view model for Projects and Digital Products
import { normalizePublicPath } from '@/lib/utils'

export type PortfolioItemKind = 'PROJECT' | 'DIGITAL_PRODUCT'

export interface PortfolioItem {
  kind: PortfolioItemKind
  slug: string
  title: string
  description: string
  thumbnail?: string | null
  category?: string | null
  tags?: string[]
  featured: boolean
  published: boolean
  publishedAt?: Date | null

  // Project-specific fields (present when kind === 'PROJECT')
  githubUrl?: string | null
  liveUrl?: string | null
  techStack?: string[]

  // Digital Product-specific fields (present when kind === 'DIGITAL_PRODUCT')
  price?: number | null
  currency?: string | null
  fileType?: string | null
}

// Transform Project to PortfolioItem
export function projectToPortfolioItem(project: any): PortfolioItem {
  return {
    kind: 'PROJECT',
    slug: project.slug,
    title: project.title,
    description: project.description || '',
    thumbnail: normalizePublicPath(project.thumbnail),
    category: project.category,
    tags: project.tags || [],
    featured: project.featured || false,
    published: project.published,
    publishedAt: project.publishedAt,
    githubUrl: project.githubUrl,
    liveUrl: project.liveUrl,
    techStack: project.techStack || [],
  }
}

// Transform DigitalProduct to PortfolioItem
export function digitalProductToPortfolioItem(product: any): PortfolioItem {
  return {
    kind: 'DIGITAL_PRODUCT',
    slug: product.slug,
    title: product.name,
    description: product.description || '',
    thumbnail: normalizePublicPath(product.thumbnailUrl),
    category: product.category,
    tags: product.tags || [],
    featured: product.featured || false,
    published: product.published,
    publishedAt: product.publishedAt,
    price: product.price ? parseFloat(product.price.toString()) : null,
    currency: product.currency,
    fileType: product.fileType,
  }
}
