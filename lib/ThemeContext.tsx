'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { ThemeName, defaultTheme } from './themes'

const ThemeContext = createContext<{
  theme: ThemeName
  setTheme: (theme: ThemeName) => void
} | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>(defaultTheme)

  useEffect(() => {
    // Load saved theme
    const saved = localStorage.getItem('theme') as ThemeName
    if (saved) setTheme(saved)
  }, [])

  useEffect(() => {
    // Apply theme
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be inside ThemeProvider')
  return context
}
