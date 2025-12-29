'use client'

import type { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'
import { PreferencesProvider } from '@/lib/preferences/PreferencesContext'
import { PreferencesGate } from '@/components/features/preferences/PreferencesGate'
import { ToastProvider } from '@/components/ui/Toast'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <PreferencesProvider>
        <ToastProvider>
          <PreferencesGate />
          {children}
        </ToastProvider>
      </PreferencesProvider>
    </SessionProvider>
  )
}
