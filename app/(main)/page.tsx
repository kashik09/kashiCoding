// Use ISR with 1-hour revalidation instead of force-dynamic for better performance
// This reduces server load and improves TTFB while keeping content relatively fresh
export const revalidate = 3600 // Revalidate every 1 hour

import { prisma } from '@/lib/prisma'
import { HomeCanvas } from '@/components/features/home'
import { normalizePublicPath } from '@/lib/utils'
import type { ProjectCardData } from '@/components/shared/ProjectCard'
import type { Metadata } from 'next'

// Add static metadata for better SEO
export const metadata: Metadata = {
  title: 'Kashi - Full-Stack Developer & Product Builder',
  description: 'I notice friction, then I build fixes. Creating calm, premium experiences that keep momentum without the noise. Full-stack developer building products with Next.js, React, and TypeScript.',
  openGraph: {
    title: 'Kashi - Full-Stack Developer & Product Builder',
    description: 'I notice friction, then I build fixes. Creating calm, premium experiences.',
    type: 'website',
  },
}

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
    href: `/products/${product.slug}`,
    meta: `${product.price.toString()} ${product.currency}`,
  }))

  return (
    <HomeCanvas projects={featuredProjects} products={products} avatarUrl={avatarUrl} />
  )
}
