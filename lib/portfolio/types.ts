// Unified view model for Projects
import { normalizePublicPath } from '@/lib/utils'

export type PortfolioItemKind = 'PROJECT'

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
  githubUrl?: string | null
  liveUrl?: string | null
  techStack?: string[]
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
