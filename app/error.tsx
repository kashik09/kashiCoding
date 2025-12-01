'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error boundary caught:', error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mb-8">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
            <svg
              className="h-10 w-10 text-destructive"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Something went wrong
          </h1>
          <p className="text-foreground-muted">
            {error.message || 'An unexpected error occurred. Please try again.'}
          </p>
          {error.digest && (
            <p className="mt-2 text-sm text-foreground-muted">
              Error ID: {error.digest}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={() => reset()} variant="primary">
            Try again
          </Button>
          <Button
            onClick={() => (window.location.href = '/')}
            variant="outline"
          >
            Go home
          </Button>
        </div>
      </div>
    </div>
  )
}
