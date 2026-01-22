'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
  type CountryCode,
} from 'libphonenumber-js'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

type Bucket = {
  id: string
  label: string
}

const BUCKETS: Bucket[] = [
  { id: 'Product access', label: 'Product access / download issue' },
  { id: 'License appeals', label: 'License / resale / abuse appeal' },
  { id: 'Policy concerns', label: 'Policy concern' },
  { id: 'Other', label: 'Other' },
]

const REASONS: Record<string, string[]> = {
  'Product access / download issue': [
    'Download limit reached',
    'Link expired',
    'Wrong file',
    'Access revoked',
    'Other',
  ],
  'License / resale / abuse appeal': [
    'License flagged',
    'Account suspended',
    'Download blocked',
    'Appeal a lock',
    'Other',
  ],
  'Policy concern': [
    'Privacy request',
    'Policy clarification',
    'Refund policy question',
    'Other',
  ],
  Other: ['Other'],
}

const TOP_COUNTRIES: CountryCode[] = [
  'GB',
  'US',
  'CA',
  'UG',
  'KE',
]

const MIN_MESSAGE_LENGTH = 25

type Step = 'bucket' | 'reason' | 'form'

type CountryOption = {
  code: CountryCode
  name: string
  dialCode: string
}

const flagForCountry = (code: string) =>
  code
    .toUpperCase()
    .replace(/[A-Z]/g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt(0))
    )

export default function ComplaintsPage() {
  const { data: session } = useSession()
  const [step, setStep] = useState<Step>('bucket')
  const [bucket, setBucket] = useState<Bucket | null>(null)
  const [reason, setReason] = useState<string>('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [countrySearch, setCountrySearch] = useState('')
  const [countryOpen, setCountryOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(null)
  const [whatsAppNumber, setWhatsAppNumber] = useState('')
  const [reference, setReference] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!session?.user) return
    setName((prev) => prev || session.user.name || '')
    setEmail((prev) => prev || session.user.email || '')
  }, [session?.user])

  const countries = useMemo(() => {
    const displayNames = new Intl.DisplayNames(['en'], { type: 'region' })
    return getCountries()
      .map((code) => ({
        code,
        name: displayNames.of(code) || code,
        dialCode: getCountryCallingCode(code),
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [])

  const topCountries = useMemo(() => {
    return TOP_COUNTRIES.map((code) => countries.find((item) => item.code === code)).filter(
      Boolean
    ) as CountryOption[]
  }, [countries])

  const filteredCountries = useMemo(() => {
    const search = countrySearch.trim().toLowerCase()
    if (!search) return countries
    return countries.filter((country) => {
      return (
        country.name.toLowerCase().includes(search) ||
        country.code.toLowerCase().includes(search) ||
        country.dialCode.includes(search.replace('+', ''))
      )
    })
  }, [countries, countrySearch])

  const otherCountries = useMemo(() => {
    const topCodes = new Set(topCountries.map((item) => item.code))
    return countries.filter((country) => !topCodes.has(country.code))
  }, [countries, topCountries])

  const handleSelectCountry = (country: CountryOption) => {
    setSelectedCountry(country)
    setCountryOpen(false)
    setCountrySearch('')
  }

  const handleBucketSelect = (nextBucket: Bucket) => {
    setBucket(nextBucket)
    setReason('')
    setStep('reason')
  }

  const handleReasonSelect = (nextReason: string) => {
    setReason(nextReason)
    setStep('form')
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setSuccess(false)

    if (!bucket) {
      setError('Kindly choose a complaint category.')
      return
    }
    if (!reason) {
      setError('Kindly choose a reason.')
      return
    }
    if (!name.trim()) {
      setError('Kindly provide your name.')
      return
    }
    const digitsOnly = whatsAppNumber.replace(/\D/g, '')
    if (digitsOnly && !selectedCountry) {
      setError('Kindly choose a country for your phone number country code.')
      return
    }
    const trimmedMessage = message.trim()
    if (trimmedMessage.length < MIN_MESSAGE_LENGTH) {
      setError('Kindly provide a few more details in your message.')
      return
    }
    let phone: string | null = null
    if (digitsOnly && selectedCountry) {
      phone = `+${selectedCountry.dialCode}${digitsOnly}`
      const parsedPhone = parsePhoneNumberFromString(phone)
      if (!parsedPhone || !parsedPhone.isPossible()) {
        setError('Please provide a valid phone number.')
        return
      }
    }
    const messageBody = [
      `Category: ${bucket.label}`,
      `Reason: ${reason}`,
      `Name: ${name.trim()}`,
      email.trim() ? `Email: ${email.trim()}` : null,
      selectedCountry ? `Country: ${selectedCountry.name} (${selectedCountry.code})` : null,
      phone ? `Phone: ${phone}` : null,
      reference.trim() ? `Reference: ${reference.trim()}` : null,
      '',
      trimmedMessage,
    ]
      .filter(Boolean)
      .join('\n')

    setSubmitting(true)
    try {
      const response = await fetch('/api/grievances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim() || undefined,
          phone: phone || undefined,
          orderNumber: reference.trim() || undefined,
          message: messageBody,
          pageUrl: typeof window !== 'undefined' ? window.location.href : undefined,
        }),
      })

      const data = await response.json().catch(() => null)
      if (!response.ok) {
        setError(data?.error || 'Something went wrong. Please try again.')
        return
      }

      setSuccess(true)
      setWhatsAppNumber('')
      setReference('')
      setMessage('')
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
          <h1 className="text-h1 font-bold text-foreground">Complaints</h1>
          <p className="text-body text-muted-foreground/90">
            Report access issues, license concerns, or policy questions.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-success/10 border border-success/20 rounded-lg text-success text-sm">
            Complaint received. We&apos;ll follow up using the contact details you provided.
          </div>
        )}

        {step === 'bucket' && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Choose a category so we can route your complaint faster.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BUCKETS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleBucketSelect(item)}
                  className="rounded-xl border border-border bg-card px-4 py-5 text-left transition hover:border-primary/40 hover:shadow-sm"
                >
                  <div className="text-base font-semibold text-foreground">
                    {item.label}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tap to choose a reason
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'reason' && bucket && (
          <div className="space-y-4">
            <button
              type="button"
              className="text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setStep('bucket')}
            >
              ← Back to categories
            </button>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {bucket.label}
              </h2>
              <p className="text-sm text-muted-foreground">
                Select the closest reason.
              </p>
            </div>
            <div className="space-y-2">
              {REASONS[bucket.label].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleReasonSelect(item)}
                  className="w-full rounded-lg border border-border bg-card px-4 py-3 text-left text-sm text-foreground transition hover:border-primary/40 hover:bg-muted/40"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'form' && bucket && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <button
              type="button"
              className="text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setStep('reason')}
            >
              ← Back to reasons
            </button>

            <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{bucket.label}</span>
              {reason ? ` · ${reason}` : ''}
              <div className="mt-1">We&apos;ll respond using the contact details you provide.</div>
            </div>

            <Input
              label="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              required
            />

            <Input
              label="email (optional)"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                phone (optional)
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="sm:max-w-[180px]">
                  <button
                    type="button"
                    onClick={() => setCountryOpen((prev) => !prev)}
                    className="w-full h-10 px-4 surface-app border border-app rounded-lg text-sm text-app focus:outline-none focus:ring-2 focus:ring-primary/35 transition text-left flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      {selectedCountry ? (
                        <>
                          <span>{flagForCountry(selectedCountry.code)}</span>
                          <span>+{selectedCountry.dialCode}</span>
                        </>
                      ) : (
                        <span className="text-muted-foreground">Select country</span>
                      )}
                    </span>
                  </button>
                </div>
                <div className="flex-1">
                  <Input
                    value={whatsAppNumber}
                    onChange={(event) => setWhatsAppNumber(event.target.value)}
                    placeholder="Phone number"
                    aria-label="phone number"
                  />
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Include a phone number if you want a call or WhatsApp reply.
              </div>
              {countryOpen && (
                <div className="rounded-lg border border-border bg-card p-3 shadow-sm">
                  <Input
                    value={countrySearch}
                    onChange={(event) => setCountrySearch(event.target.value)}
                    placeholder="Search all countries"
                  />
                  {countrySearch.trim() ? (
                    <>
                      <div className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        All countries
                      </div>
                      <div className="mt-2 max-h-60 overflow-y-auto">
                        {filteredCountries.map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            onClick={() => handleSelectCountry(country)}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm text-foreground hover:bg-muted/50"
                          >
                            <span className="flex items-center gap-2">
                              <span>{flagForCountry(country.code)}</span>
                              <span>{country.name}</span>
                            </span>
                            <span className="text-muted-foreground text-xs">
                              +{country.dialCode}
                            </span>
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Top countries
                      </div>
                      <div className="mt-2 max-h-40 overflow-y-auto">
                        {topCountries.map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            onClick={() => handleSelectCountry(country)}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm text-foreground hover:bg-muted/50"
                          >
                            <span className="flex items-center gap-2">
                              <span>{flagForCountry(country.code)}</span>
                              <span>{country.name}</span>
                            </span>
                            <span className="text-muted-foreground text-xs">
                              +{country.dialCode}
                            </span>
                          </button>
                        ))}
                      </div>
                      <div className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        All countries
                      </div>
                      <div className="mt-2 max-h-60 overflow-y-auto">
                        {otherCountries.map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            onClick={() => handleSelectCountry(country)}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm text-foreground hover:bg-muted/50"
                          >
                            <span className="flex items-center gap-2">
                              <span>{flagForCountry(country.code)}</span>
                              <span>{country.name}</span>
                            </span>
                            <span className="text-muted-foreground text-xs">
                              +{country.dialCode}
                            </span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <Input
              label="order or license reference (optional)"
              value={reference}
              onChange={(event) => setReference(event.target.value)}
              placeholder="Order #1234 or license ID"
            />

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                message
              </label>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={6}
                className="w-full px-3 py-2 text-sm bg-muted/40 border border-border/60 rounded-lg focus:border-primary/50 focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition-all resize-none text-foreground placeholder:text-muted-foreground/50"
                placeholder="Tell us what happened..."
                required
              />
            </div>

            <Button type="submit" variant="primary" size="lg" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit complaint'}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
