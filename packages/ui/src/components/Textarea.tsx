import { TextareaHTMLAttributes, forwardRef } from 'react'
import { cn } from '../lib/utils'

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-muted-foreground">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full min-h-[80px] px-4 py-3 bg-card border border-border rounded-lg text-sm text-foreground',
            'focus:outline-none focus:ring-2 focus:ring-ring/35 transition resize-y',
            'placeholder:text-muted-foreground',
            error
              ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
              : 'focus:border-primary/60',
            className
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          {...props}
        />
        {error && (
          <span id={`${textareaId}-error`} className="text-destructive text-xs font-medium" role="alert">
            {error}
          </span>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
