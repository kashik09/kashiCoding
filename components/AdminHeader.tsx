'use client'

import Link from 'next/link'
import { Home, User } from 'lucide-react'
import ThemeSelector from './ThemeSelector'

export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border backdrop-blur-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Admin Title */}
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <span className="text-2xl font-bold text-primary">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-xs text-foreground-muted">Portfolio Management</p>
              </div>
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <ThemeSelector />

            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-full hover:bg-card-hover transition text-sm font-medium text-foreground"
            >
              <Home size={16} />
              <span className="hidden md:inline">View Site</span>
            </Link>

            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
              <User size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">Admin</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
