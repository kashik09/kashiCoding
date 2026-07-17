'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Github, ExternalLink, Calendar, Tag } from 'lucide-react'
import { Spinner } from '@/components/ui/Spinner'
import { isLocalImageUrl, normalizePublicPath } from '@/lib/utils'

interface ProjectDetailData {
  id: string
  slug: string
  title: string
  description: string
  longDescription?: string | null
  image?: string | null
  technologies: string[]
  githubUrl?: string | null
  liveUrl?: string | null
  featured: boolean
  status: string
  category?: string | null
  createdAt: string
}

interface ProjectDetailResponse {
  success: boolean
  data?: ProjectDetailData
}

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const [project, setProject] = useState<ProjectDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadProject() {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(`/api/projects?slug=${params.slug}`)

        if (!response.ok) {
          throw new Error('Failed to load project')
        }

        const json = (await response.json()) as ProjectDetailResponse

        if (!json.success || !json.data) {
          throw new Error('Project not found')
        }

        if (!cancelled) {
          setProject(json.data)
        }
      } catch (err) {
        console.error('Error loading project:', err)
        if (!cancelled) {
          setError('Failed to load project details')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadProject()

    return () => {
      cancelled = true
    }
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Project not found</h1>
          <p className="text-muted-foreground">{error || 'This project could not be found.'}</p>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft size={20} />
            Back to projects
          </Link>
        </div>
      </div>
    )
  }

  const imageSrc = normalizePublicPath(project.image)
  const isLocalImage = isLocalImageUrl(imageSrc)

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl space-y-8">
        {/* Back Link */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition"
        >
          <ArrowLeft size={20} />
          Back to projects
        </Link>

        {/* Project Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-4xl font-bold text-foreground">{project.title}</h1>
            {project.featured && (
              <span className="px-3 py-1 text-sm bg-primary/20 text-primary rounded-full font-medium whitespace-nowrap">
                Featured
              </span>
            )}
          </div>

          <p className="text-xl text-muted-foreground">{project.description}</p>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {project.category && (
              <div className="flex items-center gap-2">
                <Tag size={16} />
                <span className="capitalize">{project.category.toLowerCase()}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Project Image */}
        {imageSrc && (
          <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl overflow-hidden border border-border">
            <Image
              src={imageSrc}
              alt={project.title}
              width={1200}
              height={675}
              className="w-full h-full object-cover"
              unoptimized={!isLocalImage}
              loader={isLocalImage ? undefined : ({ src }) => src}
            />
          </div>
        )}

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">Technologies</h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 text-sm bg-muted text-foreground rounded-lg border border-border"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Long Description */}
        {project.longDescription && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">About this project</h2>
            <div className="prose prose-base max-w-none text-foreground/90">
              <p className="whitespace-pre-line">{project.longDescription}</p>
            </div>
          </div>
        )}

        {/* Links */}
        <div className="flex flex-wrap gap-4 pt-4">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-card border border-border rounded-lg hover:border-primary/50 hover:bg-muted transition-all font-medium"
            >
              <Github size={20} />
              View Code
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-medium"
            >
              <ExternalLink size={20} />
              View Live
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
