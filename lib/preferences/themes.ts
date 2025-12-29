import type { ResolvedAppearance, ThemeKey } from './types'

export const THEME_KEYS: ThemeKey[] = [
  'forest',
  'night',
  'charcoal'
]

const DARK_LABELS: Record<ThemeKey, string> = {
  forest: 'Forest',
  night: 'Night',
  charcoal: 'Charcoal'
}

const LIGHT_LABELS: Record<ThemeKey, string> = {
  forest: 'Moss',
  night: 'Skyline',
  charcoal: 'Linen'
}

export function getThemeLabel(appearance: ResolvedAppearance, key: ThemeKey) {
  return appearance === 'dark' ? DARK_LABELS[key] : LIGHT_LABELS[key]
}
