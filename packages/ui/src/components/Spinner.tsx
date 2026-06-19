import { Loader2 } from 'lucide-react'
import { cn } from '../lib/utils'

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = { sm: 16, md: 24, lg: 32 }

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <Loader2
        className="animate-spin text-primary"
        size={sizes[size]}
        aria-label="Loading"
      />
    </div>
  )
}
