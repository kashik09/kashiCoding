'use client'

import { SectionFormProps, RichTextData } from '@/lib/sections/types'

export function RichTextForm({ data, onChange }: SectionFormProps<RichTextData>) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Content (Markdown)
        </label>
        <textarea
          value={data.content}
          onChange={(e) => onChange({ ...data, content: e.target.value })}
          rows={12}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 font-mono text-sm"
          placeholder="Enter markdown content..."
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Supports GitHub Flavored Markdown: headings, lists, code blocks, links, etc.
        </p>
      </div>
    </div>
  )
}
