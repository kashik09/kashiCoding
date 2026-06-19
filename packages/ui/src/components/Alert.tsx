import { forwardRef, HTMLAttributes, ReactNode } from 'react'
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react'
import { cn } from '../lib/utils'

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'destructive'
  icon?: ReactNode
}

const variants = {
  info: 'bg-info/10 border-info/30 text-info',
  success: 'bg-success/10 border-success/30 text-success',
  warning: 'bg-warning/10 border-warning/30 text-warning',
  destructive: 'bg-destructive/10 border-destructive/30 text-destructive',
}

const defaultIcons: Record<string, ReactNode> = {
  info: <Info size={20} />,
  success: <CheckCircle size={20} />,
  warning: <AlertTriangle size={20} />,
  destructive: <XCircle size={20} />,
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = 'info', icon, className, children, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(
        'flex items-start gap-3 px-4 py-3 rounded-lg border',
        variants[variant],
        className
      )}
      {...props}
    >
      <div className="shrink-0 mt-0.5">
        {icon ?? defaultIcons[variant]}
      </div>
      <div className="flex-1 text-sm">{children}</div>
    </div>
  )
)

Alert.displayName = 'Alert'
