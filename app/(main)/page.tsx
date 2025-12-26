export const dynamic = 'force-dynamic'

import { ProjectCardData } from '@/components/ProjectCard'
import { prisma } from '@/lib/prisma'
import { IntroCollage } from '@/components/home/IntroCollage'
import { normalizePublicPath, truncate } from '@/lib/utils'

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

  const featuredWorkStories = featuredProjects.map((project) => {
    const detail =
      project.technologies?.length ? project.technologies.slice(0, 2).join(' / ') : project.category
    const description = project.description ? truncate(project.description, 120) : 'featured build'
    const summary = detail ? `${description} · ${detail}` : description

    return {
      id: project.id,
      title: project.title,
      href: `/projects/${project.slug}`,
      summary,
      thumbnailUrl: normalizePublicPath(project.image)
    }
  })

  return (
    <div>
      <IntroCollage projects={featuredProjects} avatarUrl={avatarUrl} />
    </div>
  )
}
