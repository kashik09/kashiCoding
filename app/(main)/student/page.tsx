'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface VerificationStatus {
  hasVerification: boolean
  verification?: {
    id: string
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED'
    method: string
    institutionName: string
    country: string
    discountType: string
    expiresAt?: string
    createdAt: string
    reviewedAt?: string
    adminNotes?: string
  }
  eligibility?: {
    eligible: boolean
    discountPercent: number
    expiresAt?: string
    reason?: string
  }
}

export default function StudentDiscountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    method: 'SCHOOL_EMAIL' as 'SCHOOL_EMAIL' | 'ID_UPLOAD' | 'MANUAL',
    institutionName: '',
    country: '',
    schoolEmail: '',
    evidenceUrl: '',
    discountType: 'STUDENT' as 'STUDENT' | 'YOUTH_13_18',
    guardianEmail: '',
    guardianConsent: false,
  })

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/student')
      return
    }
    fetchStatus()
  }, [status])

  async function fetchStatus() {
    try {
      const res = await fetch('/api/student-verification/status')
      if (res.ok) {
        const data = await res.json()
        setVerificationStatus(data)
      }
    } catch (err) {
      console.error('Error fetching status:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setSubmitting(true)

    try {
      const res = await fetch('/api/student-verification/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to submit verification')
        return
      }

      setSuccess(data.message || 'Verification submitted successfully!')
      fetchStatus() // Refresh status
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Student & Youth Discount</h1>
      <p className="text-lg mb-8">
        Get 50% off all personal-tier products and services with verified student or youth status.
      </p>

      {/* Current Status Section */}
      {verificationStatus?.hasVerification && (
        <div className="mb-8 p-6 border rounded-lg bg-base-200">
          <h2 className="text-2xl font-semibold mb-4">Verification Status</h2>

          <div className="space-y-2">
            <p>
              <strong>Status:</strong>{' '}
              <span
                className={`badge ${
                  verificationStatus.verification?.status === 'APPROVED'
                    ? 'badge-success'
                    : verificationStatus.verification?.status === 'PENDING'
                    ? 'badge-warning'
                    : 'badge-error'
                }`}
              >
                {verificationStatus.verification?.status}
              </span>
            </p>
            <p>
              <strong>Institution:</strong> {verificationStatus.verification?.institutionName}
            </p>
            <p>
              <strong>Country:</strong> {verificationStatus.verification?.country}
            </p>
            <p>
              <strong>Type:</strong> {verificationStatus.verification?.discountType === 'YOUTH_13_18' ? 'Youth (13-18)' : 'Student'}
            </p>

            {verificationStatus.verification?.status === 'APPROVED' && (
              <>
                <p className="text-success font-semibold">
                  ✓ You have an active {verificationStatus.eligibility?.discountPercent}% discount!
                </p>
                {verificationStatus.verification?.expiresAt && (
                  <p>
                    <strong>Expires:</strong>{' '}
                    {new Date(verificationStatus.verification.expiresAt).toLocaleDateString()}
                  </p>
                )}
              </>
            )}

            {verificationStatus.verification?.status === 'PENDING' && (
              <p className="text-warning">
                Your verification is pending review. We'll email you within 1-2 business days.
              </p>
            )}

            {verificationStatus.verification?.status === 'REJECTED' && (
              <>
                <p className="text-error">Your verification was rejected.</p>
                {verificationStatus.verification?.adminNotes && (
                  <p className="text-sm">
                    <strong>Reason:</strong> {verificationStatus.verification.adminNotes}
                  </p>
                )}
                <p className="text-sm">You can reapply after 24 hours.</p>
              </>
            )}

            {verificationStatus.verification?.status === 'EXPIRED' && (
              <p className="text-error">Your verification has expired. Please reapply below.</p>
            )}
          </div>
        </div>
      )}

      {/* Application Form */}
      {(!verificationStatus?.hasVerification ||
        verificationStatus?.verification?.status === 'REJECTED' ||
        verificationStatus?.verification?.status === 'EXPIRED') && (
        <form onSubmit={handleSubmit} className="space-y-6 p-6 border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Apply for Student Discount</h2>

          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              <span>{success}</span>
            </div>
          )}

          {/* Discount Type */}
          <div>
            <label className="label">
              <span className="label-text font-semibold">Discount Type</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={formData.discountType}
              onChange={(e) =>
                setFormData({ ...formData, discountType: e.target.value as any })
              }
              required
            >
              <option value="STUDENT">Student (18+)</option>
              <option value="YOUTH_13_18">Youth (13-18, requires guardian consent)</option>
            </select>
          </div>

          {/* Verification Method */}
          <div>
            <label className="label">
              <span className="label-text font-semibold">Verification Method</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={formData.method}
              onChange={(e) => setFormData({ ...formData, method: e.target.value as any })}
              required
            >
              <option value="SCHOOL_EMAIL">School Email (.edu or institutional domain)</option>
              <option value="ID_UPLOAD">Upload Student ID</option>
              <option value="MANUAL">Manual Review (other documentation)</option>
            </select>
          </div>

          {/* Institution Name */}
          <div>
            <label className="label">
              <span className="label-text font-semibold">Institution Name</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={formData.institutionName}
              onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
              placeholder="e.g., University of California"
              required
            />
          </div>

          {/* Country */}
          <div>
            <label className="label">
              <span className="label-text font-semibold">Country</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              placeholder="e.g., United States"
              required
            />
          </div>

          {/* School Email (if method is SCHOOL_EMAIL) */}
          {formData.method === 'SCHOOL_EMAIL' && (
            <div>
              <label className="label">
                <span className="label-text font-semibold">School Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered w-full"
                value={formData.schoolEmail}
                onChange={(e) => setFormData({ ...formData, schoolEmail: e.target.value })}
                placeholder="your.name@university.edu"
                required
              />
              <p className="text-sm text-base-content/70 mt-1">
                Must be an institutional email address (.edu, .ac.*, etc.)
              </p>
            </div>
          )}

          {/* Evidence URL (if method is ID_UPLOAD or MANUAL) */}
          {(formData.method === 'ID_UPLOAD' || formData.method === 'MANUAL') && (
            <div>
              <label className="label">
                <span className="label-text font-semibold">Upload Evidence</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={formData.evidenceUrl}
                onChange={(e) => setFormData({ ...formData, evidenceUrl: e.target.value })}
                placeholder="Paste image URL or upload via contact"
                required
              />
              <p className="text-sm text-base-content/70 mt-1">
                Upload your student ID or proof of enrollment. For security, you can also email it
                directly to support instead of pasting a URL.
              </p>
            </div>
          )}

          {/* Guardian fields for Youth */}
          {formData.discountType === 'YOUTH_13_18' && (
            <>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Guardian Email</span>
                </label>
                <input
                  type="email"
                  className="input input-bordered w-full"
                  value={formData.guardianEmail}
                  onChange={(e) => setFormData({ ...formData, guardianEmail: e.target.value })}
                  placeholder="parent@example.com"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={formData.guardianConsent}
                    onChange={(e) =>
                      setFormData({ ...formData, guardianConsent: e.target.checked })
                    }
                    required
                  />
                  <span className="label-text">
                    Guardian consent: I am the legal guardian and approve this application
                  </span>
                </label>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Verification Request'}
          </button>

          <p className="text-sm text-center text-base-content/70">
            We review applications manually within 1-2 business days. You'll receive an email with
            the decision.
          </p>
        </form>
      )}

      {/* Info Section */}
      <div className="mt-12 space-y-6">
        <div className="p-6 border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">What You Get</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>50% discount on all personal-tier products</li>
            <li>50% discount on personal service subscriptions</li>
            <li>Valid for 12 months after approval</li>
            <li>Can reapply after expiration</li>
          </ul>
        </div>

        <div className="p-6 border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Strict Boundaries</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Student tier has stricter scope limits than regular personal tier</li>
            <li>Additional revisions cost extra</li>
            <li>No resale or commercial redistribution</li>
            <li>Fraud results in permanent account suspension</li>
          </ul>
        </div>

        <div className="p-6 border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Verification Process</h3>
          <ol className="list-decimal list-inside space-y-1">
            <li>Submit your application with proof (school email or ID)</li>
            <li>We manually review within 1-2 business days</li>
            <li>Approval email sent with instructions</li>
            <li>Discount automatically applied at checkout</li>
          </ol>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link href="/shop" className="btn btn-outline">
          Browse Products
        </Link>
      </div>
    </div>
  )
}
