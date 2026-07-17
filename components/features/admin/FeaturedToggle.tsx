'use client'

import { useState } from 'react'
import { Star, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'
import { Button } from '@/components/ui/Button'

interface FeaturedToggleProps {
  slug: string
  initialFeatured: boolean
  onToggle?: (featured: boolean) => void
}

export function FeaturedToggle({
  slug,
  initialFeatured,
  onToggle
}: FeaturedToggleProps) {
  const { showToast } = useToast()
  const [featured, setFeatured] = useState(initialFeatured)
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    try {
      setLoading(true)
      const newFeatured = !featured

      const response = await fetch(`/api/admin/projects/${slug}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ featured: newFeatured })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update featured status')
      }

      setFeatured(newFeatured)
      showToast(
        newFeatured ? 'Project featured' : 'Removed from featured',
        'success'
      )

      if (onToggle) {
        onToggle(newFeatured)
      }
    } catch (error) {
      console.error('Error toggling featured status:', error)
      showToast(
        error instanceof Error ? error.message : 'Failed to update',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant={featured ? 'primary' : 'outline'}
      size="sm"
      onClick={handleToggle}
      disabled={loading}
      icon={
        loading ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Star size={14} fill={featured ? 'currentColor' : 'none'} />
        )
      }
    >
      {featured ? 'Featured' : 'Feature'}
    </Button>
  )
}

interface FeaturedCheckboxProps {
  slug: string
  initialFeatured: boolean
  onToggle?: (featured: boolean) => void
  disabled?: boolean
}

export function FeaturedCheckbox({
  slug,
  initialFeatured,
  onToggle,
  disabled = false
}: FeaturedCheckboxProps) {
  const { showToast } = useToast()
  const [featured, setFeatured] = useState(initialFeatured)
  const [loading, setLoading] = useState(false)

  const handleChange = async (checked: boolean) => {
    if (disabled) return

    try {
      setLoading(true)

      const response = await fetch(`/api/admin/projects/${slug}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ featured: checked })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update featured status')
      }

      setFeatured(checked)

      if (onToggle) {
        onToggle(checked)
      }
    } catch (error) {
      console.error('Error toggling featured status:', error)
      showToast(
        error instanceof Error ? error.message : 'Failed to update',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={featured}
        onChange={(e) => handleChange(e.target.checked)}
        disabled={disabled || loading}
        className="h-4 w-4 rounded border-border bg-muted text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      />
      {loading && <Loader2 size={14} className="text-muted-foreground animate-spin" />}
    </div>
  )
}
