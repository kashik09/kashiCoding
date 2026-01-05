'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePendingAction } from '@/lib/usePendingAction'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

type ResetPasswordPageProps = {
  params: {
    token: string
  }
}

export default function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const token = typeof params?.token === 'string' ? params.token : ''
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const { isPending, run } = usePendingAction()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')

    if (!password || !confirmPassword) {
      setError('Please enter your new password twice.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    await run(async () => {
      const response = await fetch('/api/auth/password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password })
      })

      if (!response.ok) {
        setError('Invalid or expired reset link.')
        return
      }

      window.location.assign('/login')
    })
  }

  return (
    <div className="w-full max-w-md p-8 bg-card rounded-2xl shadow-2xl border border-border relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none"></div>

      <div className="relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Reset your password</h1>
          <p className="text-muted-foreground">Choose a new password for your account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <Input
            label="New password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <Input
            label="Confirm password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isPending || !token}
          >
            {isPending ? 'Updating...' : 'Update password'}
          </Button>
        </form>

        <Link href="/login" className="block">
          <Button variant="outline" size="lg" className="w-full">
            Back to Login
          </Button>
        </Link>
      </div>
    </div>
  )
}
