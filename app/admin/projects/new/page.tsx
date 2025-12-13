'use client'

import { useState } from 'react'
import { ArrowLeft, Upload, Plus, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NewProjectPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [techStack, setTechStack] = useState<string[]>([])
  const [techInput, setTechInput] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    category: '',
    githubUrl: '',
    liveUrl: '',
    featured: false,
    published: true
  })

  // Preset suggestions
  const tagSuggestions = [
    'javascript', 'typescript', 'react', 'nextjs', 'calculator',
    'webapp', 'mobile', 'api', 'fullstack', 'backend', 'frontend',
    'ui-ux', 'database', 'authentication', 'realtime', 'ai'
  ]

  const techSuggestions = [
    'React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS',
    'Node.js', 'PostgreSQL', 'Prisma', 'MongoDB', 'Express',
    'Swift', 'PHP', 'Python', 'Git', 'Vercel', 'Supabase',
    'NextAuth', 'Framer Motion', 'Lucide React', 'Zod'
  ]

  const addTag = (tag?: string) => {
    const tagToAdd = tag || tagInput.trim()
    if (tagToAdd && !tags.includes(tagToAdd)) {
      setTags([...tags, tagToAdd])
      if (!tag) setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }

  const addTech = (tech?: string) => {
    const techToAdd = tech || techInput.trim()
    if (techToAdd && !techStack.includes(techToAdd)) {
      setTechStack([...techStack, techToAdd])
      if (!tech) setTechInput('')
    }
  }

  const removeTech = (tech: string) => {
    setTechStack(techStack.filter(t => t !== tech))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags,
          techStack,
          features: []
        })
      })

      if (response.ok) {
        router.push('/admin/projects')
      } else {
        alert('Failed to create project')
      }
    } catch (error) {
      alert('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/projects"
          className="p-2 hover:bg-secondary rounded-lg transition"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">New Project</h1>
          <p className="text-foreground/70">Add a new project to your portfolio</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-secondary rounded-2xl border border-border p-6 space-y-6">
          {/* Title & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Project Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-primary border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
                placeholder="JS Calculator"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 bg-primary border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
                placeholder="js-calculator"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 bg-primary border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition resize-none"
              placeholder="A brief description of your project..."
              required
            />
          </div>

          {/* Category & URLs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 bg-primary border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
                required
              >
                <option value="">Select category...</option>
                <option value="PERSONAL">Personal</option>
                <option value="CLASS">Class</option>
                <option value="WEB_DEVELOPMENT">Web Development</option>
                <option value="MOBILE_DEVELOPMENT">Mobile Development</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                GitHub URL
              </label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="w-full px-4 py-2 bg-primary border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Live URL
              </label>
              <input
                type="url"
                value={formData.liveUrl}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                className="w-full px-4 py-2 bg-primary border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tags
            </label>

            {/* Suggestions */}
            <div className="mb-3">
              <p className="text-xs text-foreground/60 mb-2">Click to add or type your own:</p>
              <div className="flex flex-wrap gap-2">
                {tagSuggestions.filter(s => !tags.includes(s)).map(suggestion => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => addTag(suggestion)}
                    className="px-2 py-1 text-xs bg-accent/10 text-accent border border-accent/30 rounded hover:bg-accent/20 transition"
                  >
                    + {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-4 py-2 bg-primary border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
                placeholder="Type a custom tag and press Enter"
              />
              <button
                type="button"
                onClick={() => addTag()}
                className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-primary border border-border rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-destructive"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tech Stack
            </label>

            {/* Suggestions */}
            <div className="mb-3">
              <p className="text-xs text-foreground/60 mb-2">Click to add or type your own:</p>
              <div className="flex flex-wrap gap-2">
                {techSuggestions.filter(s => !techStack.includes(s)).map(suggestion => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => addTech(suggestion)}
                    className="px-2 py-1 text-xs bg-accent/10 text-accent border border-accent/30 rounded hover:bg-accent/20 transition"
                  >
                    + {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                className="flex-1 px-4 py-2 bg-primary border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
                placeholder="Type a custom technology and press Enter"
              />
              <button
                type="button"
                onClick={() => addTech()}
                className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {techStack.map(tech => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-primary border border-border rounded-full text-sm flex items-center gap-2"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTech(tech)}
                    className="hover:text-destructive"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Thumbnail Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Thumbnail Image
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent transition-colors cursor-pointer">
              <Upload className="mx-auto mb-4 text-foreground/50" size={32} />
              <p className="text-foreground/70 mb-2">Upload project thumbnail</p>
              <p className="text-foreground/50 text-sm">PNG, JPG up to 5MB</p>
              <input type="file" accept="image/*" className="hidden" />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-4">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 rounded border-border mt-1"
              />
              <div>
                <span className="text-foreground font-medium">Featured Project</span>
                <p className="text-xs text-foreground/60 mt-1">
                  Featured projects appear first on your projects page and homepage, highlighting your best work.
                </p>
              </div>
            </label>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4 rounded border-border mt-1"
              />
              <div>
                <span className="text-foreground font-medium">Publish Immediately</span>
                <p className="text-xs text-foreground/60 mt-1">
                  Make this project visible to visitors right away. Uncheck to save as draft.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/projects"
            className="px-6 py-3 border border-border rounded-lg hover:bg-secondary transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  )
}
