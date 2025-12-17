'use client'

import { SectionFormProps, HeroData } from '@/lib/sections/types'
import { Input } from '@/components/ui/Input'

export function HeroForm({ data, onChange }: SectionFormProps<HeroData>) {
  return (
    <div className="space-y-4">
      <Input
        label="Title"
        value={data.title}
        onChange={(e) => onChange({ ...data, title: e.target.value })}
        required
        placeholder="Enter hero title"
      />
      <Input
        label="Subtitle"
        value={data.subtitle || ''}
        onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
        placeholder="Optional subtitle"
      />
      <Input
        label="CTA Button Text"
        value={data.ctaText || ''}
        onChange={(e) => onChange({ ...data, ctaText: e.target.value })}
        placeholder="e.g., Get Started"
      />
      <Input
        label="CTA Button Link"
        value={data.ctaLink || ''}
        onChange={(e) => onChange({ ...data, ctaLink: e.target.value })}
        placeholder="e.g., /contact"
      />
    </div>
  )
}
