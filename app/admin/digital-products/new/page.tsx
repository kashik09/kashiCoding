'use client'

export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft, Upload } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/components/ui/Toast'
import { Spinner } from '@/components/ui/Spinner'
const CATEGORIES = [
  { value: 'TEMPLATE', label: 'Template' },
  { value: 'THEME', label: 'Theme' },
  { value: 'UI_KIT', label: 'UI Kit' },
  { value: 'CODE_SNIPPET', label: 'Code Snippet' },
  { value: 'DOCUMENTATION', label: 'Documentation' },
  { value: 'ASSET', label: 'Asset' },
  { value: 'LICENSE', label: 'License' },
  { value: 'OTHER', label: 'Other' }
]
export default function NewDigitalProductPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    category: 'TEMPLATE',
    price: '',
    fileUrl: '',
    fileSize: '',
    fileType: '',
    thumbnailUrl: '',
    personalLicense: true,
    commercialLicense: true,
    teamLicense: false,
    published: false,
    featured: false,
    version: '1.0.0',
    tags: '',
    changelog: '',
    documentation: ''
  })
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }
  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    setFormData(prev => ({ ...prev, name, slug }))
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      // Validate required fields
      if (!formData.name || !formData.slug || !formData.description || !formData.price || !formData.fileUrl || !formData.fileSize || !formData.fileType) {
        showToast('Please fill in all required fields', 'error')
        setSaving(false)
        return
      }
      const response = await fetch('/api/admin/digital-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          category: formData.category,
          price: parseFloat(formData.price),
          fileUrl: formData.fileUrl,
          fileSize: parseInt(formData.fileSize),
          fileType: formData.fileType,
          thumbnailUrl: formData.thumbnailUrl || null,
          personalLicense: formData.personalLicense,
          commercialLicense: formData.commercialLicense,
          teamLicense: formData.teamLicense,
          published: formData.published,
          featured: formData.featured,
          version: formData.version,
          tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
          changelog: formData.changelog || null,
          documentation: formData.documentation || null
        })
      })
      const data = await response.json()
      if (data.success) {
        showToast('Product created successfully', 'success')
        router.push('/admin/digital-products')
      } else {
        showToast(data.error || 'Failed to create product', 'error')
      }
    } catch (error) {
      console.error('Error creating product:', error)
      showToast('Failed to create product', 'error')
    } finally {
      setSaving(false)
    }
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/digital-products"
          className="p-2 hover:bg-muted rounded-lg transition"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">New Digital Product</h1>
          <p className="text-muted-foreground">Add a new digital product to your store</p>
        </div>
      </div>
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
          <h2 className="text-xl font-semibold text-foreground">Basic Information</h2>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Product Name <span className="text-error">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleNameChange}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              required
              placeholder="My Awesome Template"
            />
          </div>
          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Slug <span className="text-error">*</span>
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              required
              placeholder="my-awesome-template"
            />
            <p className="text-sm text-muted-foreground mt-1">
              URL-friendly version of the name (auto-generated)
            </p>
          </div>
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description <span className="text-error">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition resize-none"
              required
              placeholder="A detailed description of your product..."
            />
          </div>
          {/* Category and Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Category <span className="text-error">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Price (USD) <span className="text-error">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                required
                placeholder="29.99"
              />
            </div>
          </div>
          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              placeholder="react, nextjs, tailwind (comma-separated)"
            />
          </div>
        </div>
        {/* Files */}
        <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
          <h2 className="text-xl font-semibold text-foreground">Files</h2>
          {/* File URL */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Product File URL <span className="text-error">*</span>
            </label>
            <input
              type="url"
              name="fileUrl"
              value={formData.fileUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              required
              placeholder="https://example.com/files/product.zip"
            />
          </div>
          {/* File Size and Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                File Size (bytes) <span className="text-error">*</span>
              </label>
              <input
                type="number"
                name="fileSize"
                value={formData.fileSize}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                required
                placeholder="1024000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                File Type <span className="text-error">*</span>
              </label>
              <input
                type="text"
                name="fileType"
                value={formData.fileType}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                required
                placeholder="zip"
              />
            </div>
          </div>
          {/* Thumbnail URL */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Thumbnail URL
            </label>
            <input
              type="url"
              name="thumbnailUrl"
              value={formData.thumbnailUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              placeholder="https://example.com/images/thumbnail.jpg"
            />
          </div>
        </div>
        {/* License Types */}
        <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Available Licenses</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="personalLicense"
                checked={formData.personalLicense}
                onChange={handleChange}
                className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
              />
              <div>
                <span className="text-foreground font-medium">Personal License</span>
                <p className="text-sm text-muted-foreground">For individual use</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="commercialLicense"
                checked={formData.commercialLicense}
                onChange={handleChange}
                className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
              />
              <div>
                <span className="text-foreground font-medium">Commercial License</span>
                <p className="text-sm text-muted-foreground">For commercial projects</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="teamLicense"
                checked={formData.teamLicense}
                onChange={handleChange}
                className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
              />
              <div>
                <span className="text-foreground font-medium">Team License</span>
                <p className="text-sm text-muted-foreground">For team collaboration</p>
              </div>
            </label>
          </div>
        </div>
        {/* Additional Information */}
        <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
          <h2 className="text-xl font-semibold text-foreground">Additional Information</h2>
          {/* Version */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Version
            </label>
            <input
              type="text"
              name="version"
              value={formData.version}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              placeholder="1.0.0"
            />
          </div>
          {/* Changelog */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Changelog
            </label>
            <textarea
              name="changelog"
              value={formData.changelog}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition resize-none"
              placeholder="Version history and changes..."
            />
          </div>
          {/* Documentation */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Documentation
            </label>
            <textarea
              name="documentation"
              value={formData.documentation}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition resize-none"
              placeholder="Installation and usage instructions..."
            />
          </div>
        </div>
        {/* Publishing Options */}
        <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Publishing Options</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="published"
                checked={formData.published}
                onChange={handleChange}
                className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
              />
              <div>
                <span className="text-foreground font-medium">Publish Immediately</span>
                <p className="text-sm text-muted-foreground">Make this product available to customers</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
              />
              <div>
                <span className="text-foreground font-medium">Featured Product</span>
                <p className="text-sm text-muted-foreground">Highlight this product on the store</p>
              </div>
            </label>
          </div>
        </div>
        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
          >
            {saving ? (
              <>
                <Spinner size="sm" />
                Creating...
              </>
            ) : (
              <>
                <Save size={20} />
                Create Product
              </>
            )}
          </button>
          <Link
            href="/admin/digital-products"
            className="px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/70 transition"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
