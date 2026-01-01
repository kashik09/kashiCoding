'use client'

import { AmbientBackdrop } from '@/components/shared/AmbientBackdrop'

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AmbientBackdrop className="min-h-screen bg-base-100 text-base-content">
      {children}
    </AmbientBackdrop>
  )
}
