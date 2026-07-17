type DashboardCardProps = {
  title?: string
  subtitle?: string
  rightSlot?: React.ReactNode
  children?: React.ReactNode
  className?: string
  headerClassName?: string
  bodyClassName?: string
}

const buildClassName = (...parts: Array<string | undefined>) =>
  parts.filter(Boolean).join(' ')

export default function DashboardCard({
  title,
  subtitle,
  rightSlot,
  children,
  className,
  headerClassName,
  bodyClassName,
}: DashboardCardProps) {
  const hasHeader = Boolean(title || subtitle || rightSlot)

  return (
    <div
      className={buildClassName(
        'rounded-2xl border border-border bg-card shadow-sm p-6',
        className
      )}
    >
      {hasHeader && (
        <div className={buildClassName('flex items-start justify-between gap-4', headerClassName)}>
          <div className="space-y-1">
            {title && <h3 className="text-xl font-semibold text-foreground">{title}</h3>}
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          {rightSlot && <div className="shrink-0">{rightSlot}</div>}
        </div>
      )}
      {children && (
        <div className={buildClassName(hasHeader ? 'mt-4' : '', bodyClassName)}>
          {children}
        </div>
      )}
    </div>
  )
}
