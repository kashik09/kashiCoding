import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/lib/ThemeContext'
import { ToastProvider } from '@/components/ui/Toast'
import { CookieNotice } from '@/components/CookieNotice'
import './globals.css'
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Kashi Kweyu | Junior Developer',
  description: 'Portfolio of Kashi Kweyu - Junior Developer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning data-theme="dracula">
      <body className={inter.className}>
        <ThemeProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
        <Analytics />
        <CookieNotice />
      </body>
    </html>
  )
}
