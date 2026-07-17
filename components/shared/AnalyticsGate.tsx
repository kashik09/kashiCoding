'use client'

import { useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/next'

const STORAGE_KEY = 'cookieConsentAnalytics'

function readConsent(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(STORAGE_KEY) === 'true'
}

export function AnalyticsGate() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const sync = () => setEnabled(readConsent())

    sync()

    const handleStorage = (event: StorageEvent) => {
      if (!event.key || event.key === STORAGE_KEY) {
        sync()
      }
    }

    const handleCustom = () => sync()

    window.addEventListener('storage', handleStorage)
    window.addEventListener('analytics-consent', handleCustom)

    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('analytics-consent', handleCustom)
    }
  }, [])

  if (!enabled) return null

  return <Analytics />
}
