import { forwardRef, HTMLAttributes } from 'react'
import { cn } from '../lib/utils'

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: 'max-w-[42rem]',
  md: 'max-w-[56rem]',
  lg: 'max-w-[72rem]',
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ size = 'lg', className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'mx-auto w-full px-4 sm:px-6',
        sizes[size],
        className
      )}
      {...props}
    />
  )
)

Container.displayName = 'Container'
