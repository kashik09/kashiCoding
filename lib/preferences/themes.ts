import type { ResolvedAppearance, ThemeKey } from './types'

export const THEME_KEYS = ['forest', 'night', 'copper'] as const

const THEME_LABELS_DARK: Record<ThemeKey, string> = {
  forest: 'Forest',
  night: 'Night',
  copper: 'Copper'
}

const THEME_LABELS_LIGHT: Record<ThemeKey, string> = {
  forest: 'Forest',
  night: 'Night',
  copper: 'Copper'
}

export function getThemeLabel(appearance: ResolvedAppearance, key: ThemeKey) {
  return appearance === 'light' ? THEME_LABELS_LIGHT[key] : THEME_LABELS_DARK[key]
}
