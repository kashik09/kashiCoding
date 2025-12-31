'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { PreferencesPanel } from './PreferencesPanel'

interface PreferencesModalProps {
  onClose: () => void
}

export function PreferencesModal({ onClose }: PreferencesModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    // Focus the modal
    const modal = modalRef.current
    if (modal) {
      const focusable = modal.querySelector<HTMLElement>(
        'button:not([disabled])'
      )
      focusable?.focus()
    }

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-base-300/60 backdrop-blur-lg"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preferences-title"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-md rounded-3xl border border-base-300 bg-base-200 px-8 py-10 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full border border-base-300 bg-base-100/50 p-2 text-base-content transition hover:bg-base-100"
          aria-label="Close preferences"
        >
          <X size={16} />
        </button>

        <h2
          id="preferences-title"
          className="mb-6 text-2xl font-bold text-base-content"
        >
          Preferences
        </h2>

        <PreferencesPanel />
      </div>
    </div>
  )
}
