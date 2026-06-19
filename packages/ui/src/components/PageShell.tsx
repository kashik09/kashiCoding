import { ReactNode } from 'react'
import { cn } from '../lib/utils'

export interface PageShellProps {
  header?: ReactNode
  sidebar?: ReactNode
  mobileNav?: ReactNode
  footer?: ReactNode
  children: ReactNode
  className?: string
  sidebarClassName?: string
  mainClassName?: string
}

export function PageShell({
  header,
  sidebar,
  mobileNav,
  footer,
  children,
  className,
  sidebarClassName,
  mainClassName,
}: PageShellProps) {
  return (
    <div className={cn('min-h-screen bg-background text-foreground', className)}>
      {header}
      {mobileNav}
      <div className="flex flex-1">
        {sidebar && (
          <aside className={cn('hidden md:block', sidebarClassName)}>
            {sidebar}
          </aside>
        )}
        <main className={cn('flex-1', mainClassName)}>{children}</main>
      </div>
      {footer}
    </div>
  )
}
