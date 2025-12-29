import type { ResolvedAppearance, ThemeKey } from './types'

export const THEME_KEYS: ThemeKey[] = [
  'forest',
  'obsidian',
  'night',
  'dracula',
  'synthwave',
  'cyberpunk',
  'black'
]

const DARK_LABELS: Record<ThemeKey, string> = {
  forest: 'Forest',
  obsidian: 'Obsidian',
  night: 'Night',
  dracula: 'Dracula',
  synthwave: 'Synthwave',
  cyberpunk: 'Cyberpunk',
  black: 'Black',
  charcoal: 'Charcoal'
}

const LIGHT_LABELS: Record<ThemeKey, string> = {
  forest: 'Moss',
  obsidian: 'Pearl',
  night: 'Skyline',
  dracula: 'Pearl',
  synthwave: 'Aurora',
  cyberpunk: 'Prism',
  black: 'White',
  charcoal: 'Linen'
}

export function getThemeLabel(appearance: ResolvedAppearance, key: ThemeKey) {
  return appearance === 'dark' ? DARK_LABELS[key] : LIGHT_LABELS[key]
}
