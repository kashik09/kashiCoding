import { forwardRef, HTMLAttributes } from 'react'
import { cn } from '../lib/utils'

export const Section = forwardRef<
  HTMLElement,
  HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <section
    ref={ref}
    className={cn('py-12 md:py-16', className)}
    {...props}
  />
))

Section.displayName = 'Section'
