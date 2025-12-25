'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { ProjectCard, ProjectCardData } from '@/components/ProjectCard'
import { FeaturedProjectsList } from '@/components/FeaturedProjects'
import { usePageTracking, useAnalytics } from '@/lib/useAnalytics'

export default function ProjectsPage() {
  // Track page view automatically
  usePageTracking('Projects Page')
  const { trackClick, trackProjectView, trackEvent } = useAnalytics()

  const [filter, setFilter] = useState<'ALL' | 'PERSONAL' | 'CLASS'>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [projects, setProjects] = useState<ProjectCardData[]>([])
  const [featuredProjects, setFeaturedProjects] = useState<ProjectCardData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch projects from API
  useEffect(() => {
    fetchProjects()
  }, [filter, searchQuery])

  const fetchProjects = async () => {
    setLoading(true)
    setError('')

    try {
      const params = new URLSearchParams()
      if (filter !== 'ALL') params.append('category', filter)
      if (searchQuery) params.append('search', searchQuery)

      const response = await fetch(`/api/projects?${params}`)

      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }

      const data = await response.json()
      const allProjects = data.data || []

      // Split into featured and archive
      setFeaturedProjects(allProjects.filter((p: ProjectCardData) => p.featured))
      setProjects(allProjects)

      // Track filter usage
      if (filter !== 'ALL') {
        trackEvent({
          action: 'filter_used',
          category: 'projects',
          label: filter
        })
      }

      // Track search usage
      if (searchQuery) {
        trackEvent({
          action: 'search_used',
          category: 'projects',
          label: searchQuery
        })
      }
    } catch (err) {
      console.error('Error fetching projects:', err)
      setError('Failed to load projects. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilter: 'ALL' | 'PERSONAL' | 'CLASS') => {
    setFilter(newFilter)
    trackClick(`Filter: ${newFilter}`, 'Projects Page')
  }

  const handleProjectClick = (project: ProjectCardData) => {
    trackProjectView(project.id, project.title)
  }

  // Archive projects (not featured)
  const archiveProjects = projects.filter(p => !p.featured)

  return (
    <div className="space-y-16 py-12">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-foreground">projects</h1>
        <p className="text-muted-foreground max-w-2xl">
          things i've built to solve real problems or learn something new
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={fetchProjects}>Try Again</Button>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Featured Projects */}
          {featuredProjects.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">featured</h2>
              <FeaturedProjectsList projects={featuredProjects} />
            </section>
          )}

          {/* Archive Section */}
          {archiveProjects.length > 0 && (
            <section className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">archive</h2>
                <p className="text-sm text-muted-foreground">
                  earlier work and experiments. not everything here is polished.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={filter === 'ALL' ? 'primary' : 'outline'}
                    onClick={() => handleFilterChange('ALL')}
                    size="sm"
                  >
                    all
                  </Button>
                  <Button
                    variant={filter === 'PERSONAL' ? 'primary' : 'outline'}
                    onClick={() => handleFilterChange('PERSONAL')}
                    size="sm"
                  >
                    personal
                  </Button>
                  <Button
                    variant={filter === 'CLASS' ? 'primary' : 'outline'}
                    onClick={() => handleFilterChange('CLASS')}
                    size="sm"
                  >
                    class
                  </Button>
                </div>

                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <input
                    type="text"
                    placeholder="search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-foreground"
                  />
                </div>
              </div>

              {/* Archive Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {archiveProjects.map((project) => (
                  <div key={project.id} onClick={() => handleProjectClick(project)}>
                    <ProjectCard project={project} variant="public" />
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && !error && projects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">no projects found</p>
        </div>
      )}
    </div>
  )
}
