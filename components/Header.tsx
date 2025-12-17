"use client"

import Link from "next/link"
import { Code2, Menu, X, User, LogOut } from "lucide-react"
import { useState } from "react"
import { ThemeSelector } from "./ThemeSelector"
import { useSession, signOut } from "next-auth/react"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { data: session, status } = useSession()

  const isAuthed = status === "authenticated"

  const publicLinks = [
    { href: "/projects", label: "Projects" },
    { href: "/services", label: "Services" },
    { href: "/about", label: "About" },
    { href: "/request", label: "Request" }
  ]

  const authedLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/services", label: "Services" },
    { href: "/about-developer", label: "About Developer" },
    { href: "/request", label: "Request" }
  ]

  const navLinks = isAuthed ? authedLinks : publicLinks

  const displayName =
    session?.user?.name?.split(" ")[0] ||
    session?.user?.email?.split("@")[0] ||
    "Account"

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border shadow-sm">
      <nav className="container mx-auto px-6 md:px-8 lg:px-12 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary hover:opacity-80 transition">
            <Code2 size={28} />
            <span>Kashi Kweyu</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground hover:text-primary transition font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <ThemeSelector />

            {!isAuthed ? (
              <Link
                href="/login"
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full hover:bg-primary/20 transition font-medium"
              >
                <User size={16} />
                <span className="text-sm">Login</span>
              </Link>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="px-4 py-2 border border-border rounded-full hover:bg-card transition text-sm font-medium"
                >
                  {displayName}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="p-2 rounded-full hover:bg-destructive/10 transition"
                  aria-label="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-card border border-border hover:bg-card-hover transition"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-border">
            <div className="flex flex-col gap-3">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 rounded-lg hover:bg-card transition font-medium"
                >
                  {link.label}
                </Link>
              ))}

              {!isAuthed ? (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-center font-medium"
                >
                  Login
                </Link>
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 bg-card rounded-lg text-center font-medium"
                  >
                    {displayName}
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      signOut({ callbackUrl: "/" })
                    }}
                    className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-medium"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
