// ============================================
// ENUMS
// ============================================

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum Theme {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
  SYSTEM = 'SYSTEM',
}

export enum ProjectCategory {
  WEB_DEVELOPMENT = 'WEB_DEVELOPMENT',
  MOBILE_DEVELOPMENT = 'MOBILE_DEVELOPMENT',
  UI_UX_DESIGN = 'UI_UX_DESIGN',
  FULL_STACK = 'FULL_STACK',
  BACKEND = 'BACKEND',
  FRONTEND = 'FRONTEND',
  DEVOPS = 'DEVOPS',
  DATA_SCIENCE = 'DATA_SCIENCE',
  MACHINE_LEARNING = 'MACHINE_LEARNING',
  BLOCKCHAIN = 'BLOCKCHAIN',
  GAME_DEVELOPMENT = 'GAME_DEVELOPMENT',
  OTHER = 'OTHER',
  PERSONAL = 'PERSONAL',
  CLASS = 'CLASS',
}

// ============================================
// USER & AUTHENTICATION TYPES
// ============================================

export interface User {
  id: string
  email: string
  emailVerified?: Date | null
  name?: string | null
  image?: string | null
  role: Role
  theme: Theme
  createdAt: Date
  updatedAt: Date
}

export interface Account {
  id: string
  userId: string
  type: string
  provider: string
  providerAccountId: string
  refresh_token?: string | null
  access_token?: string | null
  expires_at?: number | null
  token_type?: string | null
  scope?: string | null
  id_token?: string | null
  session_state?: string | null
}

export interface Session {
  id: string
  sessionToken: string
  userId: string
  expires: Date
}

// ============================================
// PROJECT TYPES
// ============================================

export interface Project {
  id: string
  slug: string
  title: string
  description: string
  category: ProjectCategory
  tags: string[]
  techStack: string[]
  features: string[]
  images: string[]
  thumbnail?: string | null
  githubUrl?: string | null
  liveUrl?: string | null
  demoUrl?: string | null
  caseStudyUrl?: string | null
  content?: string | null
  featured: boolean
  viewCount: number
  likeCount: number
  published: boolean
  publishedAt?: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface CreateProjectInput {
  slug: string
  title: string
  description: string
  category: ProjectCategory
  tags?: string[]
  techStack: string[]
  features?: string[]
  images?: string[]
  thumbnail?: string
  githubUrl?: string
  liveUrl?: string
  demoUrl?: string
  caseStudyUrl?: string
  content?: string
  featured?: boolean
  published?: boolean
}

export interface UpdateProjectInput {
  slug?: string
  title?: string
  description?: string
  category?: ProjectCategory
  tags?: string[]
  techStack?: string[]
  features?: string[]
  images?: string[]
  thumbnail?: string
  githubUrl?: string
  liveUrl?: string
  demoUrl?: string
  caseStudyUrl?: string
  content?: string
  featured?: boolean
  published?: boolean
  publishedAt?: Date
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    pageSize: number
    totalPages: number
    totalCount: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// ============================================
// FORM TYPES
// ============================================

export interface ContactFormData {
  name: string
  email: string
  subject?: string
  message: string
}

// ============================================
// UTILITY TYPES
// ============================================

export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type ID = string
