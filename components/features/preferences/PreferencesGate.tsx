'use client'

import { useEffect, useState } from 'react'
import { usePreferences } from '@/lib/preferences/PreferencesContext'
import type { ThemeKey } from '@/lib/preferences/types'

type ResolvedAppearance = 'light' | 'dark'

const getSystemAppearance = (media: MediaQueryList): ResolvedAppearance =>
  media.matches ? 'dark' : 'light'

export const THEME_PAIRS = {
  forest:    { dark: 'forest',    light: 'moss' },
  obsidian:  { dark: 'obsidian',  light: 'pearl' },
  night:     { dark: 'night',     light: 'skyline' },
  dracula:   { dark: 'dracula',   light: 'pearl' },
  synthwave: { dark: 'synthwave', light: 'aurora' },
  cyberpunk: { dark: 'cyberpunk', light: 'prism' },
  black:     { dark: 'black',     light: 'white' },
  charcoal:  { dark: 'charcoal',  light: 'linen' },
} as const

const DARK_THEME_MAP: Record<ThemeKey, string> = {
  forest: THEME_PAIRS.forest.dark,
  obsidian: THEME_PAIRS.obsidian.dark,
  night: THEME_PAIRS.night.dark,
  dracula: THEME_PAIRS.dracula.dark,
  synthwave: THEME_PAIRS.synthwave.dark,
  cyberpunk: THEME_PAIRS.cyberpunk.dark,
  black: THEME_PAIRS.black.dark,
  charcoal: THEME_PAIRS.charcoal.dark,
}

const LIGHT_THEME_MAP: Record<ThemeKey, string> = {
  forest: THEME_PAIRS.forest.light,
  obsidian: THEME_PAIRS.obsidian.light,
  night: THEME_PAIRS.night.light,
  dracula: THEME_PAIRS.dracula.light,
  synthwave: THEME_PAIRS.synthwave.light,
  cyberpunk: THEME_PAIRS.cyberpunk.light,
  black: THEME_PAIRS.black.light,
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
