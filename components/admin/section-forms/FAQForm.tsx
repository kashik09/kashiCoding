'use client'

import { SectionFormProps, FAQData, FAQItem } from '@/lib/sections/types'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Trash2, Plus } from 'lucide-react'

export function FAQForm({ data, onChange }: SectionFormProps<FAQData>) {
  const addItem = () => {
    onChange({
      ...data,
      items: [...data.items, { question: '', answer: '' }],
    })
  }

  const removeItem = (index: number) => {
    onChange({
      ...data,
      items: data.items.filter((_, i) => i !== index),
    })
  }

  const updateItem = (index: number, field: keyof FAQItem, value: string) => {
    const newItems = [...data.items]
    newItems[index] = { ...newItems[index], [field]: value }
    onChange({ ...data, items: newItems })
  }

  return (
    <div className="space-y-4">
      <Input
        label="Section Title"
        value={data.title || ''}
        onChange={(e) => onChange({ ...data, title: e.target.value })}
        placeholder="e.g., Frequently Asked Questions"
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Questions & Answers
          </label>
          <Button onClick={addItem} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Add FAQ
          </Button>
        </div>

        {data.items.map((item, index) => (
          <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                FAQ {index + 1}
              </span>
              <button
                onClick={() => removeItem(index)}
                className="text-red-600 hover:text-red-700 dark:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <Input
              label="Question"
              value={item.question}
              onChange={(e) => updateItem(index, 'question', e.target.value)}
              required
              placeholder="What is your question?"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Answer
              </label>
              <textarea
                value={item.answer}
                onChange={(e) => updateItem(index, 'answer', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 text-sm"
                placeholder="Provide a detailed answer..."
                required
              />
            </div>
          </div>
        ))}

        {data.items.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            No FAQs yet. Click "Add FAQ" to get started.
          </p>
        )}
      </div>
    </div>
  )
}
