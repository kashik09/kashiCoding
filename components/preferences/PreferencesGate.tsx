'use client'

import { useEffect, useState } from 'react'
import { usePreferences } from '@/lib/preferences/PreferencesContext'
import type { ThemeKey } from '@/lib/preferences/types'

type ResolvedAppearance = 'light' | 'dark'

const getSystemAppearance = (media: MediaQueryList): ResolvedAppearance =>
  media.matches ? 'dark' : 'light'

export const THEME_PAIRS = {
  forest:   { dark: 'forest',   light: 'moss' },
  night:    { dark: 'night',    light: 'skyline' },
  charcoal: { dark: 'charcoal', light: 'linen' },
} as const

const DARK_THEME_MAP: Record<ThemeKey, string> = {
  forest: THEME_PAIRS.forest.dark,
  night: THEME_PAIRS.night.dark,
  charcoal: THEME_PAIRS.charcoal.dark,
}

const LIGHT_THEME_MAP: Record<ThemeKey, string> = {
  forest: THEME_PAIRS.forest.light,
  night: THEME_PAIRS.night.light,
  charcoal: THEME_PAIRS.charcoal.light,
}

export function PreferencesGate() {
  const { preferences } = usePreferences()
  const [systemAppearance, setSystemAppearance] = useState<ResolvedAppearance>('light')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const update = () => setSystemAppearance(getSystemAppearance(media))

    update()

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', update)
      return () => media.removeEventListener('change', update)
    }

    media.addListener(update)
    return () => media.removeListener(update)
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') return

    const root = document.documentElement
    const resolvedAppearance =
      preferences.appearance === 'system' ? systemAppearance : preferences.appearance
    const resolvedTheme =
      resolvedAppearance === 'dark'
        ? DARK_THEME_MAP[preferences.theme]
        : LIGHT_THEME_MAP[preferences.theme]

    root.setAttribute('data-appearance', resolvedAppearance)
    root.setAttribute('data-theme', resolvedTheme)
  }, [preferences.appearance, preferences.theme, systemAppearance])

  return null
}
