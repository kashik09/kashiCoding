export const themes = {
  onedark: {
    name: 'One Dark Pro',
    value: 'onedark',
    icon: '🌙',
  },
  tokyonight: {
    name: 'Tokyo Night',
    value: 'tokyonight',
    icon: '🌃',
  },
  monokai: {
    name: 'Monokai Pro',
    value: 'monokai',
    icon: '🎨',
  },
  githublight: {
    name: 'GitHub Light',
    value: 'githublight',
    icon: '☀️',
  },
} as const

export type ThemeName = keyof typeof themes
export const defaultTheme: ThemeName = 'onedark'
