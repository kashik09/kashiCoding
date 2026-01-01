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
          <div className="mb-6 flex justify-center">
            <img
              src="/illustrations/500/500-error-cuate.svg"
              className="themed-illustration theme-illustration inline-illustration block w-full max-w-xs sm:max-w-sm"
              data-variant="light"
              alt=""
              aria-hidden="true"
            />
            <img
              src="/illustrations/500/500-error-pana.svg"
              className="themed-illustration theme-illustration inline-illustration block w-full max-w-xs sm:max-w-sm"
              data-variant="dark"
              alt=""
              aria-hidden="true"
            />
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
