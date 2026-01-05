'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export function ProductsWishlistLink() {
  const { data: session, status } = useSession()
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    if (status !== 'authenticated' || !session?.user?.id) {
      setCount(null)
      return
    }

    let isMounted = true

    fetch('/api/me/wishlist')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isMounted) return
        const total = Array.isArray(data?.items) ? data.items.length : null
        setCount(typeof total === 'number' ? total : null)
      })
      .catch(() => {})

    return () => {
      isMounted = false
    }
  }, [session?.user?.id, status])

  return (
    <Link
      href="/products/wishlist"
      className="inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-full border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:border-primary/40 hover:text-primary"
      aria-label="Saved for later"
    >
      <Heart className="h-4 w-4 shrink-0" />
      <span>Saved for later</span>
      {typeof count === 'number' && (
        <span className="ml-1 inline-flex min-w-[1.25rem] shrink-0 items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-primary-foreground">
          {count}
        </span>
      )}
    </Link>
  )
}
