'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Shield, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'

export default function VerifyTwoFactorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/admin'

  const [token, setToken] = useState('')
  const [rememberDevice, setRememberDevice] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/2fa/verify-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, rememberDevice }),
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Invalid verification code')
      }
      router.replace(callbackUrl)
    } catch (err: any) {
      setError(err.message || 'Failed to verify 2FA')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="w-full max-w-xl mx-auto bg-card border border-border rounded-2xl p-8 shadow-lg">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-2">
          Two-Factor Verification
        </h1>
        <p className="text-muted-foreground text-center mb-6">
          Enter a code from your authenticator app or a backup code to continue.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm flex items-start gap-3">
            <AlertCircle className="flex-shrink-0 mt-0.5" size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          <Input
            label="Verification Code"
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value.trim())}
            placeholder="123456 or backup code"
            autoComplete="one-time-code"
            required
          />

          <label className="flex items-center gap-3 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={rememberDevice}
              onChange={(e) => setRememberDevice(e.target.checked)}
              className="w-4 h-4 rounded border-border"
            />
            Remember this device for 7 days
          </label>

          <Button
            type="submit"
            size="lg"
            variant="primary"
            className="w-full"
            disabled={loading || !token}
            loading={loading}
          >
            {loading ? <><Spinner size="sm" /> Verifying...</> : 'Verify & Continue'}
          </Button>
        </form>
      </div>
    </div>
  )
}
