'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LayoutDashboard, FolderKanban, FileText, Users, Settings, LogOut, Shield, Megaphone, ArrowUp, Package } from 'lucide-react'
import AdminHeader from '@/components/AdminHeader'
import { ToastProvider } from '@/components/ui/Toast'
import { SessionProvider } from 'next-auth/react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [showScrollButton, setShowScrollButton] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/projects', icon: FolderKanban, label: 'Projects' },
    { href: '/admin/digital-products', icon: Package, label: 'Digital Products' },
    { href: '/admin/requests', icon: FileText, label: 'Requests' },
    { href: '/admin/ads', icon: Megaphone, label: 'Ads' },
    { href: '/admin/users', icon: Users, label: 'Users' },
    { href: '/admin/security', icon: Shield, label: 'Security' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <SessionProvider>
      <ToastProvider>
        <div className="min-h-screen bg-background">
        <AdminHeader />

        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 min-h-[calc(100vh-73px)] bg-card border-r border-border sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-lg font-bold text-foreground mb-6">Navigation</h2>

              <nav className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>

              <div className="mt-8 pt-8 border-t border-border">
                <Link
                  href="/"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <LogOut size={20} />
                  <span>Back to Site</span>
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-8 bg-background">
            <div className="pointer-events-auto">
              {children}
            </div>
          </main>
        </div>

        {/* Scroll to Top Button */}
        {showScrollButton && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-4 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all hover:scale-110 active:scale-95 z-50"
            aria-label="Scroll to top"
          >
            <ArrowUp size={24} />
          </button>
        )}
      </div>
    </ToastProvider>
    </SessionProvider>
  )
}