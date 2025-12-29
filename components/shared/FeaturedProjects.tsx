'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Star, ArrowRight } from 'lucide-react'
import { ProjectCard, ProjectCardData } from './ProjectCard'

interface FeaturedProjectsProps {
  projects: ProjectCardData[]
  variant?: 'full' | 'compact'
  showViewAll?: boolean
}

export function FeaturedProjects({
  projects,
  variant = 'full',
  showViewAll = true
}: FeaturedProjectsProps) {
  if (projects.length === 0) {
    return null
  }

  return (
    <section>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Star className="text-primary" size={24} fill="currentColor" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                Featured Projects
              </h2>
              <p className="text-muted-foreground">
                Showcasing my best work
              </p>
            </div>
          </div>

          {showViewAll && (
            <Link
              href="/projects"
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition group"
            >
              <span className="font-medium">View All</span>
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          )}
        </div>

        {/* Projects Grid */}
        {variant === 'full' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} variant="public" />
            ))}
          </div>
        ) : (
          <FeaturedProjectsList projects={projects} />
        )}
      </div>
    </section>
  )
}

export function FeaturedProjectsList({
  projects
}: {
  projects: ProjectCardData[]
}) {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      itemRefs.current.forEach(item => {
        if (item) {
          item.style.opacity = '1'
          item.style.transform = 'translateY(0)'
        }
      })
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('project-visible')
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
    )

    itemRefs.current.forEach((item) => {
      if (item) observer.observe(item)
    })

    return () => observer.disconnect()
  }, [projects])

  if (projects.length === 0) return null

  return (
    <>
      <style jsx global>{`
        .project-item {
          opacity: 0;
          transform: translateY(24px) scale(0.98);
          transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .project-visible {
          opacity: 1 !important;
          transform: translateY(0) scale(1) !important;
        }

        .project-connector {
          opacity: 0;
          transform: scaleY(0);
          transform-origin: top;
          transition: opacity 0.3s ease, transform 0.3s ease;
          transition-delay: 0.2s;
        }

        .project-visible + .project-connector {
          opacity: 1;
          transform: scaleY(1);
        }

        @media (prefers-reduced-motion: reduce) {
          .project-item,
          .project-connector {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }
      `}</style>

      <div className="relative">
        {projects.map((project, index) => (
          <div key={project.id}>
            {/* Project */}
            <div
              ref={(el) => { itemRefs.current[index] = el }}
              className="project-item"
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <Link
                href={`/projects/${project.slug}`}
                className="group block"
              >
                <div className="relative p-4 sm:p-6 bg-card/50 border border-border/60 rounded-2xl hover:bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-300">
                  {/* Thumbnail + Content Grid */}
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    {/* Thumbnail */}
                    <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl overflow-hidden ring-1 ring-border/50">
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-4xl font-bold text-primary/20">
                            {project.title.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-h3 font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                          {project.title}
                        </h3>
                        <Star
                          size={16}
                          className="text-primary/60 flex-shrink-0 mt-0.5"
                          fill="currentColor"
                        />
                      </div>

                      <p className="text-body text-muted-foreground/90 line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>

                      {/* Tech Stack */}
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {project.technologies.slice(0, 4).map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-0.5 text-xs bg-muted/60 text-foreground/70 rounded-md border border-border/30"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 4 && (
                            <span className="px-2 py-0.5 text-xs text-muted-foreground/60">
                              +{project.technologies.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Arrow hint */}
                    <ArrowRight
                      size={18}
                      className="hidden sm:block text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 self-center"
                    />
                  </div>

                  {/* Next hint (on last non-hovered) */}
                  {index < projects.length - 1 && (
                    <div className="absolute -bottom-3 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="text-xs text-primary/60 bg-card px-2 py-0.5 rounded-full border border-primary/20 shadow-sm">
                        next →
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            </div>

            {/* Connector line between projects */}
            {index < projects.length - 1 && (
              <div className="project-connector flex justify-center my-2">
                <div className="w-px h-6 bg-gradient-to-b from-border/60 via-primary/30 to-border/60" />
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}
