'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Spinner } from '@/components/ui/Spinner'

type FormState = {
  name: string
  age: string
  schoolEmail: string
  guardianEmail: string
  consent: boolean
}

export default function StudentsPage() {
  const [form, setForm] = useState<FormState>({
    name: '',
    age: '',
    schoolEmail: '',
    guardianEmail: '',
    consent: false,
  })
  const [idFile, setIdFile] = useState<File | null>(null)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'pending' | 'error'>('idle')
  const [error, setError] = useState<string>('')

  const ageValue = Number(form.age)
  const requiresGuardian = Number.isFinite(ageValue) && ageValue >= 13 && ageValue < 18

  const updateField = (key: keyof FormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const validate = () => {
    if (!form.name.trim()) return 'Name is required.'
    if (!form.age.trim()) return 'Age is required.'
    if (!Number.isFinite(ageValue) || ageValue < 13 || ageValue > 18) {
      return 'Student discount is limited to ages 13-18.'
    }
    if (!form.schoolEmail.trim()) return 'School email is required.'
    if (requiresGuardian && !form.guardianEmail.trim()) {
      return 'Guardian email is required for applicants under 18.'
    }
    if (!form.consent) return 'You must confirm the verification statement.'
    return ''
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      setStatus('error')
      return
    }

    try {
      setStatus('submitting')
      const payload = new FormData()
      payload.append('name', form.name)
      payload.append('age', form.age)
      payload.append('schoolEmail', form.schoolEmail)
      if (form.guardianEmail) payload.append('guardianEmail', form.guardianEmail)
      if (idFile) payload.append('idFile', idFile)

      const response = await fetch('/api/students/verification', {
        method: 'POST',
        body: payload,
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit verification request')
      }

      setStatus('pending')
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 space-y-12">
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Student discount</p>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Student pricing with extra guardrails
          </h1>
          <p className="text-lg text-muted-foreground">
            Available for ages 13-18 with verification. Scope is tighter, approvals are manual, and guardian consent is required for minors.
          </p>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10">
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">How verification works</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Submit the form with a school email.</li>
                <li>Optional: upload a student ID for faster review.</li>
                <li>We manually verify within 2-5 business days.</li>
                <li>Discounts apply after approval only.</li>
              </ul>
            </div>

            <div className="bg-muted/40 border border-border rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Important boundaries</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Living systems and large builds require subscription support.</li>
                <li>Scope changes require extra credits or payment.</li>
                <li>No refunds after purchase or payment.</li>
              </ul>
              <Link href="/pricing" className="text-sm text-primary hover:underline">
                See pricing details
              </Link>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Submit verification</h2>

            {status === 'pending' ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Your verification request is pending. We will email you after manual review.
                </p>
                <Link href="/pricing" className="text-sm text-primary hover:underline">
                  Back to pricing
                </Link>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <label className="block text-sm text-foreground">
                  Name
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    required
                  />
                </label>

                <label className="block text-sm text-foreground">
                  Age (13-18)
                  <input
                    type="number"
                    min={13}
                    max={18}
                    value={form.age}
                    onChange={(e) => updateField('age', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    required
                  />
                </label>

                <label className="block text-sm text-foreground">
                  School email
                  <input
                    type="email"
                    value={form.schoolEmail}
                    onChange={(e) => updateField('schoolEmail', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    required
                  />
                </label>

                <label className="block text-sm text-foreground">
                  Guardian email (required under 18)
                  <input
                    type="email"
                    value={form.guardianEmail}
                    onChange={(e) => updateField('guardianEmail', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    required={requiresGuardian}
                  />
                </label>

                <label className="block text-sm text-foreground">
                  Optional student ID upload
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => setIdFile(e.target.files?.[0] || null)}
                    className="mt-1 w-full text-sm text-muted-foreground"
                  />
                </label>

                <label className="flex items-start gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={(e) => updateField('consent', e.target.checked)}
                    className="mt-1"
                    required
                  />
                  <span>
                    I confirm the information is accurate and I agree to the student discount terms.
                  </span>
                </label>

                {status === 'error' && error ? (
                  <p className="text-sm text-destructive">{error}</p>
                ) : null}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full py-3 px-6 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition disabled:opacity-60"
                >
                  {status === 'submitting' ? (
                    <span className="flex items-center justify-center gap-2">
                      <Spinner size="sm" />
                      Submitting...
                    </span>
                  ) : (
                    'Submit verification'
                  )}
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
