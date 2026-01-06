'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

type GrievanceFormData = {
  name: string
  email: string
  phone: string
  orderNumber: string
  message: string
}

const MIN_MESSAGE_LENGTH = 10

export default function GrievancesPage() {
  const { data: session } = useSession()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<GrievanceFormData>({
    name: '',
    email: '',
    phone: '',
    orderNumber: '',
    message: '',
  })

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  const whatsappHref = useMemo(() => {
    return whatsappNumber ? `https://wa.me/${whatsappNumber}` : null
  }, [whatsappNumber])

  useEffect(() => {
    if (!session?.user) return
    setFormData((prev) => ({
      ...prev,
      name: prev.name || session.user.name || '',
      email: prev.email || session.user.email || '',
    }))
  }, [session?.user])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setSuccess(false)

    const trimmedMessage = formData.message.trim()
    if (trimmedMessage.length < MIN_MESSAGE_LENGTH) {
      setError('Please provide a few more details in your message.')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch('/api/grievances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          message: trimmedMessage,
          pageUrl: typeof window !== 'undefined' ? window.location.href : undefined,
        }),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        setError(data?.error || 'Something went wrong. Please try again.')
        return
      }

      setSuccess(true)
      setFormData((prev) => ({
        name: prev.name,
        email: prev.email,
        phone: '',
        orderNumber: '',
        message: '',
      }))
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ paddingTop: 'var(--space-block)', paddingBottom: 'var(--space-section)' }}>
      <div className="container-sm space-y-6">
        <div className="space-y-2">
          <h1 className="text-h1 font-bold text-foreground">Grievances</h1>
          <p className="text-body text-muted-foreground/90">
            Share any concerns or issues so we can make things right.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-success/10 border border-success/20 rounded-lg text-success text-sm">
            Thanks for sharing. Your grievance has been submitted.
            {whatsappHref && (
              <div className="mt-2">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="text-success underline"
                >
                  Escalate on WhatsApp
                </a>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="name (optional)"
              value={formData.name}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, name: event.target.value }))
              }
              placeholder="Your name"
            />
            <Input
              label="email (optional)"
              type="email"
              value={formData.email}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, email: event.target.value }))
              }
              placeholder="you@example.com"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="phone (optional)"
              value={formData.phone}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, phone: event.target.value }))
              }
              placeholder="+256..."
            />
            <Input
              label="order number (optional)"
              value={formData.orderNumber}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  orderNumber: event.target.value,
                }))
              }
              placeholder="Order #1234"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              message
            </label>
            <textarea
              value={formData.message}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, message: event.target.value }))
              }
              rows={6}
              className="w-full px-3 py-2 text-sm bg-muted/40 border border-border/60 rounded-lg focus:border-primary/50 focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition-all resize-none text-foreground placeholder:text-muted-foreground/50"
              placeholder="Tell us what happened..."
              required
            />
          </div>

          <Button type="submit" variant="primary" size="lg" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit grievance'}
          </Button>
        </form>
      </div>
    </div>
  )
}
