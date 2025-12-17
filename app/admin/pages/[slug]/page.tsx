'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save, Plus, Trash2, Eye, EyeOff, ChevronUp, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { StyledSelect } from '@/components/ui/StyledSelect'
import { Spinner } from '@/components/ui/Spinner'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { sectionRegistry, getAllSectionTypes } from '@/lib/sections/registry'
import { SectionType } from '@/lib/sections/types'

interface PageData {
  id?: string
  slug: string
  title: string
  status: 'DRAFT' | 'PUBLISHED'
  seoTitle: string
  seoDescription: string
}

interface Section {
  id?: string
  type: SectionType
  data: any
  order: number
}

export default function VisualPageEditor() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string
  const isNew = slug === 'new'

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [pageData, setPageData] = useState<PageData>({
    slug: '',
    title: '',
    status: 'DRAFT',
    seoTitle: '',
    seoDescription: ''
  })
  const [sections, setSections] = useState<Section[]>([])
  const [selectedSectionIndex, setSelectedSectionIndex] = useState<number | null>(null)
  const [showPreview, setShowPreview] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; sectionIndex: number | null }>({
    open: false,
    sectionIndex: null
  })

  useEffect(() => {
    if (!isNew) {
      fetchPage()
    }
  }, [slug, isNew])

  const fetchPage = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/pages/${slug}`)
      const data = await response.json()

      if (data.success) {
        const page = data.data
        setPageData({
          id: page.id,
          slug: page.slug,
          title: page.title,
          status: page.status,
          seoTitle: page.seoTitle || '',
          seoDescription: page.seoDescription || ''
        })
        setSections(page.sections || [])
      } else {
        console.error('Failed to fetch page:', data.error)
        alert('Failed to load page')
        router.push('/admin/pages')
      }
    } catch (error) {
      console.error('Error fetching page:', error)
      alert('Error loading page')
      router.push('/admin/pages')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!pageData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!pageData.slug.trim()) {
      newErrors.slug = 'Slug is required'
    } else if (!/^[a-z0-9-]+$/.test(pageData.slug)) {
      newErrors.slug = 'Slug must be lowercase letters, numbers, and hyphens only'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    try {
      setSaving(true)

      const pageResponse = await fetch(
        isNew ? '/api/pages' : `/api/pages/${slug}`,
        {
          method: isNew ? 'POST' : 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pageData)
        }
      )

      const pageResult = await pageResponse.json()

      if (!pageResult.success) {
        alert('Failed to save page: ' + pageResult.error)
        return
      }

      if (isNew && sections.length > 0) {
        const createdPageSlug = pageResult.data.slug

        for (const section of sections) {
          await fetch(`/api/pages/${createdPageSlug}/sections`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: section.type,
              data: section.data,
              order: section.order
            })
          })
        }

        router.push(`/admin/pages/${createdPageSlug}`)
      } else if (!isNew && sections.length > 0) {
        const sectionsWithIds = sections.filter(s => s.id)
        if (sectionsWithIds.length > 0) {
          await fetch(`/api/pages/${slug}/sections`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sections: sectionsWithIds })
          })
        }

        const newSections = sections.filter(s => !s.id)
        for (const section of newSections) {
          await fetch(`/api/pages/${slug}/sections`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: section.type,
              data: section.data,
              order: section.order
            })
          })
        }

        await fetchPage()
      } else if (!isNew) {
        router.push('/admin/pages')
      }

      alert('Page saved successfully!')
    } catch (error) {
      console.error('Error saving page:', error)
      alert('Error saving page')
    } finally {
      setSaving(false)
    }
  }

  const addSection = (type: SectionType) => {
    const entry = sectionRegistry[type]
    const newSection: Section = {
      type,
      data: entry.defaultData,
      order: sections.length
    }
    setSections([...sections, newSection])
    setSelectedSectionIndex(sections.length)
  }

  const updateSection = (index: number, data: any) => {
    const updated = [...sections]
    updated[index] = { ...updated[index], data }
    setSections(updated)
  }

  const deleteSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index))
    if (selectedSectionIndex === index) {
      setSelectedSectionIndex(null)
    }
    setDeleteModal({ open: false, sectionIndex: null })
  }

  const moveSectionUp = (index: number) => {
    if (index === 0) return
    const updated = [...sections]
    ;[updated[index - 1], updated[index]] = [updated[index], updated[index - 1]]
    updated.forEach((section, i) => {
      section.order = i
    })
    setSections(updated)
    if (selectedSectionIndex === index) {
      setSelectedSectionIndex(index - 1)
    } else if (selectedSectionIndex === index - 1) {
      setSelectedSectionIndex(index)
    }
  }

  const moveSectionDown = (index: number) => {
    if (index === sections.length - 1) return
    const updated = [...sections]
    ;[updated[index], updated[index + 1]] = [updated[index + 1], updated[index]]
    updated.forEach((section, i) => {
      section.order = i
    })
    setSections(updated)
    if (selectedSectionIndex === index) {
      setSelectedSectionIndex(index + 1)
    } else if (selectedSectionIndex === index + 1) {
      setSelectedSectionIndex(index)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  const selectedSection = selectedSectionIndex !== null ? sections[selectedSectionIndex] : null
  const SelectedFormComponent = selectedSection ? sectionRegistry[selectedSection.type].formComponent : null

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/admin/pages')}
            size="sm"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">
              {isNew ? 'Create New Page' : `Edit: ${pageData.title}`}
            </h1>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            size="sm"
          >
            {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
          </Button>
          <Button onClick={handleSave} disabled={saving} size="sm">
            <Save size={18} className="mr-2" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Page Settings */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Page Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            label="Title"
            placeholder="About Us"
            value={pageData.title}
            onChange={(e) => setPageData({ ...pageData, title: e.target.value })}
            error={errors.title}
            required
          />
          <Input
            label="Slug"
            placeholder="about"
            value={pageData.slug}
            onChange={(e) => setPageData({ ...pageData, slug: e.target.value.toLowerCase() })}
            error={errors.slug}
            required
            disabled={!isNew}
          />
          <StyledSelect
            label="Status"
            value={pageData.status}
            onChange={(e) => setPageData({ ...pageData, status: e.target.value as 'DRAFT' | 'PUBLISHED' })}
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </StyledSelect>
        </div>
      </div>

      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Section List */}
        <div className="lg:col-span-3 space-y-3">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-foreground">Sections</h2>
            </div>

            <StyledSelect
              value=""
              onChange={(e) => {
                if (e.target.value) {
                  addSection(e.target.value as SectionType)
                  e.target.value = ''
                }
              }}
            >
              <option value="">+ Add Section</option>
              {getAllSectionTypes().map((type) => {
                const entry = sectionRegistry[type]
                return (
                  <option key={type} value={type}>
                    {entry.icon} {entry.label}
                  </option>
                )
              })}
            </StyledSelect>

            <div className="mt-3 space-y-2">
              {sections.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No sections yet
                </p>
              ) : (
                sections.map((section, index) => {
                  const entry = sectionRegistry[section.type]
                  const isSelected = selectedSectionIndex === index
                  return (
                    <div
                      key={index}
                      className={`border rounded-lg p-3 cursor-pointer transition ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedSectionIndex(index)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground flex items-center gap-2">
                          <span>{entry.icon}</span>
                          {entry.label}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setDeleteModal({ open: true, sectionIndex: index })
                          }}
                          className="text-red-600 dark:text-red-400 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            moveSectionUp(index)
                          }}
                          disabled={index === 0}
                          className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            moveSectionDown(index)
                          }}
                          disabled={index === sections.length - 1}
                          className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                        >
                          <ChevronDown size={14} />
                        </button>
                        <span className="text-xs text-muted-foreground ml-2">
                          Position {index + 1}
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* Middle: Section Form */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-card border border-border rounded-lg p-4 min-h-[400px]">
            {selectedSection && SelectedFormComponent ? (
              <>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  {sectionRegistry[selectedSection.type].label} Settings
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  {sectionRegistry[selectedSection.type].description}
                </p>
                <SelectedFormComponent
                  data={selectedSection.data}
                  onChange={(data) => updateSection(selectedSectionIndex!, data)}
                />
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <p className="text-lg mb-2">No section selected</p>
                  <p className="text-sm">Select or add a section to edit</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Live Preview */}
        {showPreview && (
          <div className="lg:col-span-5 space-y-3">
            <div className="bg-card border border-border rounded-lg p-4">
              <h2 className="text-lg font-semibold text-foreground mb-3">Live Preview</h2>
              <div className="border border-border rounded-lg overflow-hidden bg-background">
                {sections.length === 0 ? (
                  <div className="flex items-center justify-center h-64 text-muted-foreground">
                    <p>Add sections to see preview</p>
                  </div>
                ) : (
                  <div className="space-y-0">
                    {sections.map((section, index) => {
                      const Component = sectionRegistry[section.type].component
                      return (
                        <div
                          key={index}
                          className={`${
                            selectedSectionIndex === index ? 'ring-2 ring-primary' : ''
                          }`}
                        >
                          <Component data={section.data} />
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, sectionIndex: null })}
        onConfirm={() => deleteModal.sectionIndex !== null && deleteSection(deleteModal.sectionIndex)}
        title="Delete Section"
        message="Are you sure you want to delete this section? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}
