import Link from 'next/link'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { ProjectCardData } from '@/components/ProjectCard'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { StoryReveal } from '@/components/motion/StoryReveal'
import { truncate } from '@/lib/utils'

interface FeaturedWorkFlowProps {
  projects: ProjectCardData[]
}

function getFocusLine(project: ProjectCardData) {
  if (project.category) return project.category
  if (project.technologies && project.technologies.length > 0) {
    return project.technologies.slice(0, 2).join(' + ')
  }
  return 'product build'
}

function getProofLine(project: ProjectCardData) {
  if (project.technologies && project.technologies.length > 0) {
    return project.technologies.slice(0, 3).join(' / ')
  }
  return 'published work'
}

export function FeaturedWorkFlow({ projects }: FeaturedWorkFlowProps) {
  const chapters = projects.slice(0, 5)

  if (chapters.length === 0) return null

  return (
    <Section id="work">
      <Container>
        <div className="space-y-8">
          <header className="space-y-3">
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
              featured work
            </p>
            <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
              one project per beat
            </h2>
            <p className="max-w-prose text-base leading-relaxed text-muted-foreground">
              a scroll story of the builds that matter most.
            </p>
          </header>

          <div className="space-y-12 md:space-y-16">
            {chapters.map((project, index) => (
              <div key={project.id}>
                <StoryReveal
                  as="article"
                  delayMs={index * 60}
                  className="rounded-2xl border border-border/60 bg-card/40 p-6 sm:p-8"
                >
                  <div className="space-y-5">
                    <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      <span>chapter {index + 1}</span>
                    </div>
                    <h3 className="text-2xl font-semibold text-foreground sm:text-3xl">
                      {project.title}
                    </h3>

                    <dl className="space-y-3">
                      <div className="grid gap-2 sm:grid-cols-[5rem_1fr]">
                        <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          what
                        </dt>
                        <dd className="text-sm leading-relaxed text-foreground/90 sm:text-base">
                          {project.description
                            ? truncate(project.description, 120)
                            : 'case study + build details'}
                        </dd>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-[5rem_1fr]">
                        <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          focus
                        </dt>
                        <dd className="text-sm leading-relaxed text-foreground/90 sm:text-base">
                          {getFocusLine(project)}
                        </dd>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-[5rem_1fr]">
                        <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          proves
                        </dt>
                        <dd className="text-sm leading-relaxed text-foreground/90 sm:text-base">
                          {getProofLine(project)}
                        </dd>
                      </div>
                    </dl>

                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/80 transition hover:border-primary/40 hover:text-foreground"
                    >
                      open project
                      <ArrowRight size={12} />
                    </Link>

                    {index < chapters.length - 1 && (
                      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                        <span>next</span>
                        <ArrowDown size={12} />
                      </div>
                    )}
                  </div>
                </StoryReveal>

                {index < chapters.length - 1 && (
                  <div className="flex justify-center pt-8">
                    <div className="h-10 w-px bg-gradient-to-b from-border/60 via-primary/30 to-border/60" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
