'use client'

export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserPlus, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/components/ui/Toast'
export default function NewUserPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'USER',
    password: ''
  })
  const [saving, setSaving] = useState(false)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      if (data.success) {
        showToast('User created successfully', 'success')
        router.push('/admin/users')
      } else {
        showToast(data.error || 'Failed to create user', 'error')
      }
    } catch (error) {
      console.error('Error creating user:', error)
      showToast('Failed to create user', 'error')
    } finally {
      setSaving(false)
    }
  }
  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/users"
          className="p-2 hover:bg-muted rounded-lg transition"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Add New User</h1>
          <p className="text-muted-foreground">Create a new user account</p>
        </div>
      </div>
      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-6 space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
            required
          />
        </div>
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
            required
          />
        </div>
        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Password (Optional)
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Leave blank for OAuth-only users"
            className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Leave blank if the user will sign in using OAuth (Google, GitHub, etc.)
          </p>
        </div>
        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Role
          </label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
          >
            <option value="USER">User</option>
            <option value="VIEWER">Viewer</option>
            <option value="EDITOR">Editor</option>
            <option value="MODERATOR">Moderator</option>
            <option value="ADMIN">Admin</option>
          </select>
          <p className="text-sm text-muted-foreground mt-1">
            {formData.role === 'USER' && 'Regular user with basic permissions'}
            {formData.role === 'VIEWER' && 'Can view data but not make changes'}
            {formData.role === 'EDITOR' && 'Can edit content'}
            {formData.role === 'MODERATOR' && 'Can moderate content and users'}
            {formData.role === 'ADMIN' && 'Full administrative access'}
          </p>
        </div>
        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
          >
            <UserPlus size={20} />
            {saving ? 'Creating...' : 'Create User'}
          </button>
          <Link
            href="/admin/users"
            className="px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/70 transition"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
