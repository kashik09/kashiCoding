/**
 * VS Code-Inspired Theme System
 *
 * Professional color schemes inspired by popular VS Code themes
 * Each theme is self-contained (no separate light/dark modes)
 */

export type ThemeName = 'monokai' | 'one-dark-pro' | 'dracula' | 'github-light'

export interface ThemeColors {
  // Main colors
  primary: string
  'primary-foreground': string
  secondary: string
  'secondary-foreground': string
  accent: string
  'accent-secondary': string
  'accent-foreground': string

  // Background colors
  background: string
  'background-secondary': string

  // Text colors
  foreground: string
  'foreground-muted': string

  // UI colors
  border: string
  'border-light': string
  card: string
  'card-hover': string
  muted: string

  // Status colors
  destructive: string
  success: string
  warning: string
  info: string
}

export interface Theme {
  name: ThemeName
  displayName: string
  description: string
  colors: ThemeColors
  radius: {
    sm: string
    md: string
    lg: string
  }
}

// ============================================
// MONOKAI THEME - HOT PINK dark theme
// ============================================
export const monokaiTheme: Theme = {
  name: 'monokai',
  displayName: 'Monokai',
  description: 'Hot pink and neon green on dark brown',
  colors: {
    primary: '249 38 114',            // #F92672 - HOT PINK
    'primary-foreground': '255 255 255',
    secondary: '174 129 255',         // #AE81FF - Purple
    'secondary-foreground': '255 255 255',
    accent: '166 226 46',             // #A6E22E - Neon Green
    'accent-secondary': '253 151 31', // #FD971F - Orange
    'accent-foreground': '30 30 30',
    background: '30 31 26',
    'background-secondary': '39 40 34',
    foreground: '248 248 242',
    'foreground-muted': '150 150 150',
    border: '80 82 72',
    'border-light': '100 102 92',
    card: '39 40 34',
    'card-hover': '50 51 45',
    muted: '70 72 65',
    destructive: '249 38 114',
    success: '166 226 46',
    warning: '253 151 31',
    info: '102 217 239',
  },
  radius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
  },
}

// ============================================
// ONE DARK PRO THEME - Cool BLUE theme
// ============================================
export const oneDarkProTheme: Theme = {
  name: 'one-dark-pro',
  displayName: 'One Dark Pro',
  description: 'Cool blue tones on dark gray',
  colors: {
    primary: '97 175 239',            // #61AFEF - Bright Blue
    'primary-foreground': '20 20 25',
    secondary: '198 120 221',         // #C678DD - Purple
    'secondary-foreground': '255 255 255',
    accent: '86 182 194',             // #56B6C2 - Cyan
    'accent-secondary': '152 195 121', // #98C379 - Green
    'accent-foreground': '20 20 25',
    background: '25 28 33',
    'background-secondary': '33 37 43',
    foreground: '220 223 228',
    'foreground-muted': '140 145 155',
    border: '70 75 85',
    'border-light': '90 95 105',
    card: '33 37 43',
    'card-hover': '43 47 53',
    muted: '50 55 65',
    destructive: '224 108 117',
    success: '152 195 121',
    warning: '229 192 123',
    info: '97 175 239',
  },
  radius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
  },
}

// ============================================
// DRACULA THEME - PURPLE vampire theme
// ============================================
export const draculaTheme: Theme = {
  name: 'dracula',
  displayName: 'Dracula',
  description: 'Purple vampire vibes with neon accents',
  colors: {
    primary: '189 147 249',           // #BD93F9 - Bright Purple
    'primary-foreground': '20 20 30',
    secondary: '255 121 198',         // #FF79C6 - Hot Pink
    'secondary-foreground': '255 255 255',
    accent: '80 250 123',             // #50FA7B - Neon Green
    'accent-secondary': '255 184 108', // #FFB86C - Orange
    'accent-foreground': '20 20 30',
    background: '30 32 41',
    'background-secondary': '40 42 54',
    foreground: '248 248 242',
    'foreground-muted': '180 180 190',
    border: '98 114 164',
    'border-light': '118 134 184',
    card: '40 42 54',
    'card-hover': '50 52 64',
    muted: '68 71 90',
    destructive: '255 85 85',
    success: '80 250 123',
    warning: '241 250 140',
    info: '139 233 253',
  },
  radius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
  },
}

// ============================================
// GITHUB LIGHT THEME - BRIGHT light theme
// ============================================
export const githubLightTheme: Theme = {
  name: 'github-light',
  displayName: 'GitHub Light',
  description: 'Bright white with bold colors',
  colors: {
    primary: '5 80 174',              // #0550AE - Dark Blue
    'primary-foreground': '255 255 255',
    secondary: '111 66 193',          // #6F42C1 - Purple
    'secondary-foreground': '255 255 255',
    accent: '22 163 74',              // #16A34A - Green
    'accent-secondary': '234 88 12',   // #EA580C - Orange
    'accent-foreground': '255 255 255',
    background: '255 255 255',
    'background-secondary': '247 250 252',
    foreground: '15 23 42',
    'foreground-muted': '71 85 105',
    border: '226 232 240',
    'border-light': '241 245 249',
    card: '255 255 255',
    'card-hover': '248 250 252',
    muted: '241 245 249',
    destructive: '220 38 38',
    success: '22 163 74',
    warning: '234 88 12',
    info: '14 165 233',
  },
  radius: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
  },
}

// ============================================
// THEME REGISTRY
// ============================================
export const themes: Record<ThemeName, Theme> = {
  'monokai': monokaiTheme,
  'one-dark-pro': oneDarkProTheme,
  'dracula': draculaTheme,
  'github-light': githubLightTheme,
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get theme by name
 */
export function getTheme(name: ThemeName): Theme {
  return themes[name]
}

/**
 * Get all theme names
 */
export function getThemeNames(): ThemeName[] {
  return Object.keys(themes) as ThemeName[]
}

/**
 * Get theme colors
 */
export function getThemeColors(themeName: ThemeName): ThemeColors {
  return themes[themeName].colors
}

/**
 * Convert theme colors to CSS variables
 */
export function themeToCSSVariables(themeName: ThemeName): Record<string, string> {
  const colors = getThemeColors(themeName)
  const theme = getTheme(themeName)

  const cssVars: Record<string, string> = {}

  // Add color variables
  Object.entries(colors).forEach(([key, value]) => {
    cssVars[`--color-${key}`] = value
  })

  // Add radius variables
  cssVars['--radius-sm'] = theme.radius.sm
  cssVars['--radius-md'] = theme.radius.md
  cssVars['--radius-lg'] = theme.radius.lg

  return cssVars
}

/**
 * Apply theme to document root
 */
export function applyTheme(themeName: ThemeName): void {
  if (typeof document === 'undefined') return

  const root = document.documentElement

  // Set data-theme attribute
  root.setAttribute('data-theme', themeName)
}
