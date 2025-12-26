export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { HomeCanvas } from '@/components/home/HomeCanvas'
import { normalizePublicPath } from '@/lib/utils'
import type { ProjectCardData } from '@/components/ProjectCard'

export default async function HomePage() {
  const siteSettings = await prisma.siteSettings.findUnique({
    where: { id: 'site_settings_singleton' },
    select: { avatarUrl: true },
  })

  const avatarUrl = siteSettings?.avatarUrl ?? null

  // Fetch featured projects
  const featuredProjectsData = await prisma.project.findMany({
    where: {
      featured: true,
      published: true
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 5,
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      thumbnail: true,
      techStack: true,
      tags: true,
      category: true,
      githubUrl: true,
      liveUrl: true,
      featured: true
    }
  })

  const featuredProjects: ProjectCardData[] = featuredProjectsData.map((project) => ({
    id: project.id,
    slug: project.slug,
    title: project.title,
    description: project.description,
    image: project.thumbnail,
    technologies: project.techStack,
    githubUrl: project.githubUrl,
    liveUrl: project.liveUrl,
    featured: project.featured,
    category: project.category
  }))

  const productData = await prisma.digitalProduct.findMany({
    where: { published: true },
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    take: 3,
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      thumbnailUrl: true,
      price: true,
      currency: true,
    },
  })

  const products = productData.map((product) => ({
    id: product.id,
    title: product.name,
    description: product.description,
    imageUrl: normalizePublicPath(product.thumbnailUrl),
    href: `/shop/${product.slug}`,
    meta: `${product.price.toString()} ${product.currency}`,
  }))

  return (
    <div>
      <HomeCanvas projects={featuredProjects} products={products} avatarUrl={avatarUrl} />
    </div>
  )
}
