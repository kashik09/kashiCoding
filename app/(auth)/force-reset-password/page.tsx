'use client'

import { useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PasswordStrengthMeter } from '@/components/ui/PasswordStrengthMeter'
import { usePendingAction } from '@/lib/usePendingAction'
import { isValidPassword, getPasswordErrorMessage } from '@/lib/auth-utils'
import { AlertTriangle } from 'lucide-react'

export default function ForceResetPasswordPage() {
  const router = useRouter()
  const { update } = useSession()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const { isPending, run } = usePendingAction()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.')
      return
    }

    if (!isValidPassword(newPassword)) {
      const errorMsg = getPasswordErrorMessage(newPassword)
      setError(errorMsg || 'Password does not meet requirements')
      return
    }

    await run(async () => {
      const response = await fetch('/api/auth/force-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        setError(data?.error || 'Failed to update password')
        return
      }

      // Refresh session to clear mustResetPassword flag
      await update()

      // Redirect to dashboard
      router.push('/dashboard')
    })
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  return (
    <div className="w-full max-w-md p-8 bg-card rounded-2xl shadow-2xl border border-border">
      <div className="text-center mb-8">
        <div className="mx-auto w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6 text-yellow-500" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Password Update Required
        </h1>
        <p className="text-muted-foreground text-sm">
          For security reasons, you must update your password to continue. Your
          new password must meet our updated security requirements.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <Input
          label="Current password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Enter your current password"
          required
        />

        <div className="space-y-2">
          <Input
            label="New password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Create a strong password"
            required
          />
          <PasswordStrengthMeter
            password={newPassword}
            showRequirements={newPassword.length > 0}
          />
        </div>

        <Input
          label="Confirm new password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter your new password"
          required
          error={
            confirmPassword && newPassword !== confirmPassword
              ? 'Passwords do not match'
              : undefined
          }
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? 'Updating...' : 'Update Password'}
        </Button>
      </form>

      <button
        onClick={handleLogout}
        className="w-full text-sm text-muted-foreground hover:text-foreground transition"
      >
        Sign out instead
      </button>
    </div>
  )
}
