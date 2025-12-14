'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useTheme } from '@/lib/ThemeContext'
import { themes } from '@/lib/themes'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const navLinks = [
    { href: '/projects', label: 'Projects' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About' },
    { href: '/request', label: 'Request' }
  ]

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-accent hover:text-accent/80 transition">
            <span className="text-3xl">&lt;/&gt;</span>
            <span>Kashi Kweyu</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground hover:text-accent transition font-medium"
              >
                {link.label}
              </Link>
            ))}

            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as any)}
              className="px-3 py-2 bg-background border border-border rounded text-foreground cursor-pointer hover:border-accent transition"
            >
              {Object.entries(themes).map(([key, t]) => (
                <option key={key} value={key}>{t.icon} {t.name}</option>
              ))}
            </select>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-background border border-border hover:border-accent transition text-foreground"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-border">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-foreground hover:text-accent hover:bg-background/50 rounded-lg transition font-medium"
                >
                  {link.label}
                </Link>
              ))}

              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as any)}
                className="px-3 py-2 bg-background border border-border rounded text-foreground cursor-pointer"
              >
                {Object.entries(themes).map(([key, t]) => (
                  <option key={key} value={key}>{t.icon} {t.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}