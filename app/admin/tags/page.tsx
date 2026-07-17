'use client'

export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { Plus, X, Edit, Tag, Code } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'
import ConfirmModal from '@/components/ui/ConfirmModal'
interface TagItem {
  id: number
  name: string
  type: 'tag' | 'tech'
  usageCount: number
}
export default function TagsManagerPage() {
  const { showToast } = useToast()
  const [tags, setTags] = useState<TagItem[]>([
    { id: 1, name: 'javascript', type: 'tag', usageCount: 5 },
    { id: 2, name: 'React', type: 'tech', usageCount: 8 },
    { id: 3, name: 'webapp', type: 'tag', usageCount: 3 },
    { id: 4, name: 'Next.js', type: 'tech', usageCount: 6 },
  ])
  
  const [newTagName, setNewTagName] = useState('')
  const [newTagType, setNewTagType] = useState<'tag' | 'tech'>('tag')
  const [editingTag, setEditingTag] = useState<TagItem | null>(null)
  const [deleteTag, setDeleteTag] = useState<TagItem | null>(null)
  const handleAddTag = () => {
    if (!newTagName.trim()) {
      showToast('Please enter a tag name', 'warning')
      return
    }
    const newTag: TagItem = {
      id: Date.now(),
      name: newTagName.trim(),
      type: newTagType,
      usageCount: 0
    }
    setTags([...tags, newTag])
    setNewTagName('')
    showToast(`${newTagType === 'tag' ? 'Tag' : 'Tech'} added successfully`, 'success')
  }
  const handleUpdateTag = () => {
    if (!editingTag || !editingTag.name.trim()) {
      showToast('Please enter a valid name', 'warning')
      return
    }
    setTags(tags.map(t => t.id === editingTag.id ? editingTag : t))
    setEditingTag(null)
    showToast('Tag updated successfully', 'success')
  }
  const handleDeleteTag = (tag: TagItem) => {
    setTags(tags.filter(t => t.id !== tag.id))
    setDeleteTag(null)
    showToast('Tag deleted successfully', 'success')
  }
  const tagsList = tags.filter(t => t.type === 'tag')
  const techList = tags.filter(t => t.type === 'tech')
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Tags & Tech Stack Manager</h1>
        <p className="text-muted-foreground">Manage your project tags and technologies</p>
      </div>
      {/* Add New */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Add New</h2>
        <div className="flex gap-3">
          <select
            value={newTagType}
            onChange={(e) => setNewTagType(e.target.value as 'tag' | 'tech')}
            className="px-4 py-2 bg-background border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-foreground appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23999%22%20d%3D%22M10.293%203.293L6%207.586%201.707%203.293A1%201%200%2000.293%204.707l5%205a1%201%200%20001.414%200l5-5a1%201%200%2010-1.414-1.414z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[center_right_1rem] bg-no-repeat pr-10 cursor-pointer"
          >
            <option value="tag">Tag</option>
            <option value="tech">Technology</option>
          </select>
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            placeholder={`Enter ${newTagType} name...`}
            className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-foreground"
          />
          <button
            onClick={handleAddTag}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium"
          >
            <Plus size={20} />
            Add
          </button>
        </div>
      </div>
      {/* Tags List */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="text-primary" size={24} />
          <h2 className="text-xl font-bold text-foreground">Tags ({tagsList.length})</h2>
        </div>
        <div className="space-y-2">
          {tagsList.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No tags yet</p>
          ) : (
            tagsList.map(tag => (
              <div 
                key={tag.id}
                className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-sm font-medium">
                    {tag.name}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    Used in {tag.usageCount} projects
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingTag(tag)}
                    className="p-2 hover:bg-primary/10 text-primary rounded-lg transition"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => setDeleteTag(tag)}
                    className="p-2 hover:bg-error/10 text-error rounded-lg transition"
                    title="Delete"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Tech Stack List */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Code className="text-primary" size={24} />
          <h2 className="text-xl font-bold text-foreground">Technologies ({techList.length})</h2>
        </div>
        <div className="space-y-2">
          {techList.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No technologies yet</p>
          ) : (
            techList.map(tech => (
              <div 
                key={tech.id}
                className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-muted border border-border rounded-lg text-sm font-medium text-foreground">
                    {tech.name}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    Used in {tech.usageCount} projects
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingTag(tech)}
                    className="p-2 hover:bg-primary/10 text-primary rounded-lg transition"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => setDeleteTag(tech)}
                    className="p-2 hover:bg-error/10 text-error rounded-lg transition"
                    title="Delete"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Edit Modal */}
      {editingTag && (
        <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl border border-border max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-foreground mb-4">
              Edit {editingTag.type === 'tag' ? 'Tag' : 'Technology'}
            </h3>
            <input
              type="text"
              value={editingTag.name}
              onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-foreground mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setEditingTag(null)}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateTag}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteTag}
        onClose={() => setDeleteTag(null)}
        onConfirm={() => deleteTag && handleDeleteTag(deleteTag)}
        title={`Delete ${deleteTag?.type === 'tag' ? 'Tag' : 'Technology'}`}
        message={`Are you sure you want to delete "${deleteTag?.name}"? ${
          deleteTag && deleteTag.usageCount > 0 
            ? `This will remove it from ${deleteTag.usageCount} project(s).` 
            : ''
        }`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  )
}
