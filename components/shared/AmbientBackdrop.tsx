'use client'

import type { ReactNode } from 'react'

export function AmbientBackdrop({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`ambient-zone ${className}`}>
      <div className="ambient-backdrop" aria-hidden="true" />
      <div className="ambient-noise" aria-hidden="true" />
      <div className="ambient-content">{children}</div>
    </div>
  )
}
