'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { usePendingAction } from '@/lib/usePendingAction'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const { isPending, run } = usePendingAction()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    await run(async () => {
      try {
        await fetch('/api/auth/password/request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        })
      } finally {
        setSubmitted(true)
      }
    })
  }

  return (
    <div className="w-full max-w-md p-8 bg-card rounded-2xl shadow-2xl border border-border relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none"></div>

      <div className="relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Password Reset</h1>
          <p className="text-muted-foreground">Enter your email to receive a reset link</p>
        </div>

        {submitted ? (
          <div className="p-6 bg-muted/40 border border-border rounded-lg mb-6 text-sm text-foreground/80">
            If an account exists, we emailed you.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? 'Sending...' : 'Send reset link'}
            </Button>
          </form>
        )}

        <Link href="/login" className="block">
          <Button variant="outline" size="lg" className="w-full">
            Back to Login
          </Button>
        </Link>
      </div>
    </div>
  )
}
