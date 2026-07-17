import Link from 'next/link'
import { Button } from '@/components/ui/Button'
export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mb-8">
          <div className="mb-6 flex justify-center">
            <img
              src="/illustrations/404/404-error-cuate-plug.svg"
              className="themed-illustration theme-illustration block w-full max-w-xs sm:max-w-sm"
              data-variant="light"
              alt=""
              aria-hidden="true"
            />
            <img
              src="/illustrations/404/404-error-pana.svg"
              className="themed-illustration theme-illustration block w-full max-w-xs sm:max-w-sm"
              data-variant="dark"
              alt=""
              aria-hidden="true"
            />
          </div>
          <h1 className="mb-4 text-9xl font-bold text-primary">404</h1>
          <h2 className="mb-2 text-3xl font-bold text-foreground">
            Page not found
          </h2>
          <p className="text-foreground-muted">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It
            might have been moved or deleted.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/">
            <Button variant="primary">Go home</Button>
          </Link>
          <Link href="/projects">
            <Button variant="outline">Browse projects</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
