'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { ThemeName, getTheme, getThemeColors } from './themes'

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: ThemeName
  storageKey?: string
  enableTransitions?: boolean
}

interface ThemeContextType {
  theme: ThemeName
  setTheme: (theme: ThemeName) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({
  children,
  defaultTheme = 'onedark',
  storageKey = 'theme',
  enableTransitions = true,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeName>(defaultTheme)
  const [mounted, setMounted] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem(storageKey) as ThemeName
    if (savedTheme && ['onedark', 'tokyonight', 'monokai', 'githublight'].includes(savedTheme)) {
      setThemeState(savedTheme)
    }
  }, [storageKey])

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement

    // Disable transitions temporarily if not enabled
    if (!enableTransitions) {
      root.classList.add('no-transition')
    }

    // Set the data-theme attribute
    root.setAttribute('data-theme', theme)

    // Save to localStorage
    localStorage.setItem(storageKey, theme)

    // Re-enable transitions
    if (!enableTransitions) {
      setTimeout(() => {
        root.classList.remove('no-transition')
      }, 0)
    }
  }, [theme, mounted, storageKey, enableTransitions])

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme)
  }

  // Prevent flash of unstyled content
  if (!mounted) {
    return null
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

export function useIsTheme(themeName: ThemeName) {
  const { theme } = useTheme()
  return theme === themeName
}

export function useThemeColors() {
  const { theme } = useTheme()
  return getThemeColors(theme)
}