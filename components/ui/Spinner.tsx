import { Loader2 } from 'lucide-react'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  const sizes = {
    sm: 16,
    md: 24,
    lg: 32,
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2
        className="animate-spin text-primary"
        size={sizes[size]}
        aria-label="Loading"
      />
    </div>
  )
}

export default Spinner