import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { CookieNotice } from '@/components/CookieNotice'
import './globals.css'
import { Analytics } from "@vercel/analytics/next"
import { Providers } from './Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Kashi Kweyu | digital builder',
  description: 'Portfolio of Kashi Kweyu — building calm, useful products.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body className={`${inter.className} bg-base-100 text-base-content`}>
        <Providers>{children}</Providers>
        <Analytics />
        <CookieNotice />
      </body>
    </html>
  )
}
