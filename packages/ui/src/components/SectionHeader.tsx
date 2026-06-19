import { ReactNode } from 'react'
import { cn } from '../lib/utils'

export interface SectionHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
  className?: string
  align?: 'left' | 'center'
}

export function SectionHeader({
  title,
  subtitle,
  action,
  className,
  align = 'left',
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-1 mb-6 md:mb-8',
        align === 'center' && 'items-center text-center',
        action && align === 'left' && 'sm:flex-row sm:items-end sm:justify-between',
        className
      )}
    >
      <div className={cn(align === 'center' && 'max-w-2xl')}>
        <h2 className="text-h2 font-bold text-foreground">{title}</h2>
        {subtitle && (
          <p className="text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0 mt-2 sm:mt-0">{action}</div>}
    </div>
  )
}
