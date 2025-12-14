import { Cloud, Moon, Droplets, Sun, CircleDot, FileText, Gem, Waves, LucideIcon } from 'lucide-react'

export type ThemeName = 
  | 'dracula' 
  | 'tokyonight' 
  | 'ayumirage' 
  | 'ayulight'
  | 'abyss'
  | 'solarized'
  | 'quietlight'
  | 'material'

export interface Theme {
  name: string
  value: ThemeName
  icon: LucideIcon
}

export const themes: Record<ThemeName, Theme> = {
  dracula: {
    name: 'Purple Rain',
    value: 'dracula',
    icon: Cloud,
  },
  tokyonight: {
    name: 'Tokyo Night',
    value: 'tokyonight',
    icon: Moon,
  },
  ayumirage: {
    name: 'Ayu Mirage',
    value: 'ayumirage',
    icon: Droplets,
  },
  ayulight: {
    name: 'Ayu Light',
    value: 'ayulight',
    icon: Sun,
  },
  abyss: {
    name: 'Abyss',
    value: 'abyss',
    icon: CircleDot,
  },
  solarized: {
    name: 'Solarized Light',
    value: 'solarized',
    icon: FileText,
  },
  quietlight: {
    name: 'Quiet Light',
    value: 'quietlight',
    icon: FileText,
  },
  material: {
    name: 'Material Theme',
    value: 'material',
    icon: Gem,
  },
}

export const defaultTheme: ThemeName = 'tokyonight'