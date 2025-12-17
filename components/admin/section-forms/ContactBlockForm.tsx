'use client'

import { SectionFormProps, ContactBlockData } from '@/lib/sections/types'
import { Input } from '@/components/ui/Input'

export function ContactBlockForm({ data, onChange }: SectionFormProps<ContactBlockData>) {
  return (
    <div className="space-y-4">
      <Input
        label="Section Title"
        value={data.title || ''}
        onChange={(e) => onChange({ ...data, title: e.target.value })}
        placeholder="e.g., Get in Touch"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          value={data.description || ''}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 text-sm"
          placeholder="Optional description"
        />
      </div>

      <Input
        label="Email"
        type="email"
        value={data.email || ''}
        onChange={(e) => onChange({ ...data, email: e.target.value })}
        placeholder="your@email.com"
      />

      <Input
        label="Phone"
        type="tel"
        value={data.phone || ''}
        onChange={(e) => onChange({ ...data, phone: e.target.value })}
        placeholder="+1 (555) 123-4567"
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="showForm"
          checked={data.showForm !== false}
          onChange={(e) => onChange({ ...data, showForm: e.target.checked })}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="showForm" className="text-sm text-gray-700 dark:text-gray-300">
          Show contact form
        </label>
      </div>
    </div>
  )
}
