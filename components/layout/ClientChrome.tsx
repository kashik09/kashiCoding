'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { AmbientBackdrop } from '@/components/shared/AmbientBackdrop'

export default function ClientChrome({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const cinemaActive = isHome
  const mainClassName = isHome
    ? 'flex-1'
    : 'flex-1 container mx-auto px-6 md:px-8 lg:px-12 py-8'

  return (
    <AmbientBackdrop className="min-h-screen flex flex-col bg-base-100 text-base-content">
      {!cinemaActive && <Header />}
      <main className={mainClassName}>{children}</main>
      {!cinemaActive && <Footer pathname={pathname} />}
    </AmbientBackdrop>
  )
}
