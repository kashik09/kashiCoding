import { ComponentType } from 'react'

// Section data types matching existing components
export interface HeroData {
  title: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
}

export interface RichTextData {
  content: string
}

export interface ProjectGridData {
  title?: string
  filter?: 'ALL' | 'WEB' | 'MOBILE' | 'DESIGN'
  limit?: number
  includeDigitalProducts?: boolean
}

export interface Card {
  title: string
  description: string
  icon?: string
  link?: string
}

export interface CardsData {
  title?: string
  cards: Card[]
  columns?: 2 | 3 | 4
}

export interface CTAData {
  title: string
  description?: string
  buttonText: string
  buttonLink: string
  variant?: 'primary' | 'secondary'
}

export interface FAQItem {
  question: string
  answer: string
}

export interface FAQData {
  title?: string
  items: FAQItem[]
}

export interface ContactBlockData {
  title?: string
  description?: string
  showForm?: boolean
  email?: string
  phone?: string
}

// Union type for all section data
export type SectionData =
  | HeroData
  | RichTextData
  | ProjectGridData
  | CardsData
  | CTAData
  | FAQData
  | ContactBlockData

// Section types matching Prisma enum
export enum SectionType {
  HERO = 'HERO',
  RICH_TEXT = 'RICH_TEXT',
  PROJECT_GRID = 'PROJECT_GRID',
  CARDS = 'CARDS',
  CTA = 'CTA',
  FAQ = 'FAQ',
  CONTACT_BLOCK = 'CONTACT_BLOCK',
}

// Registry entry for each section type
export interface SectionRegistryEntry<T = any> {
  type: SectionType
  label: string
  description: string
  component: ComponentType<{ data: T }>
  formComponent: ComponentType<SectionFormProps<T>>
  defaultData: T
  icon: string
}

// Props for section form components
export interface SectionFormProps<T = any> {
  data: T
  onChange: (data: T) => void
  errors?: Record<string, string>
}

// Registry type
export type SectionRegistry = {
  [K in SectionType]: SectionRegistryEntry
}
