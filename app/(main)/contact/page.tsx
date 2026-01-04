'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useSession } from 'next-auth/react'

type AvailabilityData = {
  status: string
  message: string | null
}

export default function ContactPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const isAuthed = status === 'authenticated'

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isAvailable, setIsAvailable] = useState(true)
  const [checkingAvailability, setCheckingAvailability] = useState(true)
  const [availability, setAvailability] = useState<AvailabilityData | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    serviceType: '',
    budget: '',
    timeline: '',
    description: ''
  })

  useEffect(() => {
    Promise.all([
      fetch('/api/site/status').then((r) => r.json()),
      fetch('/api/site/availability').then((r) => r.json()),
    ])
      .then(([statusData, availabilityData]) => {
        setIsAvailable(statusData.data?.availableForBusiness !== false)
        if (availabilityData.success && availabilityData.data) {
          setAvailability(availabilityData.data)
        }
      })
      .catch((error) => {
        console.error('Error checking availability:', error)
      })
      .finally(() => {
        setCheckingAvailability(false)
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!isAuthed && (!formData.name || !formData.email)) {
      setError('please provide your name and email')
      setLoading(false)
      return
    }

    if (!formData.description) {
      setError('please describe what you need')
      setLoading(false)
      return
    }

    const payload = {
      ...formData,
      ...(isAuthed && {
        name: session?.user?.name ?? formData.name,
        email: session?.user?.email ?? formData.email
      })
    }

    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        if (response.status === 503) {
          setError(errorData?.error || 'Not accepting new requests at this time')
        } else {
          setError(errorData?.error || 'something went wrong. try again?')
        }
        setLoading(false)
        return
      }

      alert(
        isAvailable
          ? "got it. i'll get back to you soon."
          : "thanks for reaching out. i'll contact you when availability opens up."
      )
      router.push('/')
    } catch {
      setError('something went wrong. try again?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ paddingTop: 'var(--space-block)', paddingBottom: 'var(--space-section)' }}>
      <div className="container-sm" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-block)' }}>
        <div className="space-y-3">
          <h1 className="text-h1 font-bold text-foreground">get in touch</h1>
          <p className="text-body text-muted-foreground/90">
            working on something interesting? need help building a product? let's talk.
          </p>
        </div>

        {!checkingAvailability && availability && availability.status !== 'AVAILABLE' && (
          <div className={`rounded-lg p-4 border ${
            availability.status === 'UNAVAILABLE'
              ? 'bg-error/10 border-error/20'
              : 'bg-warning/10 border-warning/20'
          }`}>
            <div className="flex items-center gap-3 mb-2">
              <div className={`badge badge-sm ${
                availability.status === 'UNAVAILABLE'
                  ? 'badge-error'
                  : 'badge-warning'
              }`}>
                {availability.status === 'UNAVAILABLE' ? 'Unavailable' : 'Limited Availability'}
              </div>
            </div>
            <p className={`text-sm ${
              availability.status === 'UNAVAILABLE'
                ? 'text-error'
                : 'text-warning'
            }`}>
              {availability.message || "I'm not accepting new projects right now, but feel free to send your inquiry. I'll reach out when availability opens up."}
            </p>
          </div>
        )}
        {!checkingAvailability && availability && availability.status === 'AVAILABLE' && availability.message && (
          <div className="bg-success/10 border border-success/20 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="badge badge-sm badge-success">Available</div>
              <p className="text-sm text-success">
                {availability.message}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-item)' }}>
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive text-sm">
              {error}
            </div>
          )}

          {!isAuthed ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="your name"
                required
              />

              <Input
                label="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                required
              />
            </div>
          ) : (
            <div className="rounded-lg border border-border/60 bg-muted/40 px-4 py-3 text-sm text-foreground">
              sending as{' '}
              <span className="font-medium">
                {session?.user?.name || session?.user?.email}
              </span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">what do you need?</label>
            <select
              value={formData.serviceType}
              onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-muted/40 border border-border/60 rounded-lg focus:border-primary/50 focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition-all text-foreground"
            >
              <option value="">select one (optional)</option>
              <option value="WEB_DEVELOPMENT">web development</option>
              <option value="PRODUCT_DESIGN">product design</option>
              <option value="CONSULTATION">consultation</option>
              <option value="COLLABORATION">collaboration</option>
              <option value="OTHER">something else</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">budget (optional)</label>
              <select
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-muted/40 border border-border/60 rounded-lg focus:border-primary/50 focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition-all text-foreground"
              >
                <option value="">not sure yet</option>
                <option value="SMALL">small ($500-$2k)</option>
                <option value="MEDIUM">medium ($2k-$10k)</option>
                <option value="LARGE">large ($10k+)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">timeline (optional)</label>
              <select
                value={formData.timeline}
                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-muted/40 border border-border/60 rounded-lg focus:border-primary/50 focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition-all text-foreground"
              >
                <option value="">not sure yet</option>
                <option value="ASAP">asap</option>
                <option value="1_2_WEEKS">1-2 weeks</option>
                <option value="1_MONTH">1 month</option>
                <option value="FLEXIBLE">flexible</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">tell me more</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={6}
              className="w-full px-3 py-2 text-sm bg-muted/40 border border-border/60 rounded-lg focus:border-primary/50 focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition-all resize-none text-foreground placeholder:text-muted-foreground/50"
              placeholder="what are you building? what problem are you solving?"
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'sending...' : 'send message'}
          </Button>

          <p className="text-center text-sm text-muted-foreground/80">
            i'll get back to you within 24 hours
          </p>
        </form>
      </div>
    </div>
  )
}
