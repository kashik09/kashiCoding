'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface Verification {
  id: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED'
  method: string
  institutionName: string
  country: string
  schoolEmail?: string
  evidenceUrl?: string
  discountType: string
  guardianEmail?: string
  guardianConsent?: boolean
  createdAt: string
  reviewedAt?: string
  notes?: string
  user: {
    id: string
    name?: string
    email: string
    createdAt: string
  }
}

export default function StudentVerificationsAdminPage() {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  const [verifications, setVerifications] = useState<Verification[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('PENDING')
  const [error, setError] = useState<string | null>(null)

  // Reviewing state
  const [reviewing, setReviewing] = useState<string | null>(null)
  const [reviewNotes, setReviewNotes] = useState('')
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | null>(null)

  useEffect(() => {
    if (authStatus === 'loading') return
    if (authStatus === 'unauthenticated') {
      router.push('/login')
      return
    }
    if (!['ADMIN', 'OWNER'].includes(session?.user?.role || '')) {
      router.push('/')
      return
    }
    fetchVerifications()
  }, [authStatus, statusFilter])

  async function fetchVerifications() {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/student-verifications?status=${statusFilter}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setVerifications(data.verifications || [])
    } catch (err) {
      setError('Failed to load verifications')
    } finally {
      setLoading(false)
    }
  }

  async function handleReview(id: string, action: 'approve' | 'reject') {
    setReviewing(id)
    setReviewAction(action)

    try {
      const endpoint =
        action === 'approve'
          ? `/api/admin/student-verifications/${id}/approve`
          : `/api/admin/student-verifications/${id}/reject`

      const body =
        action === 'approve'
          ? { notes: reviewNotes, durationMonths: 12 }
          : { reason: reviewNotes }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to process review')
      }

      // Success - refresh list
      setReviewNotes('')
      setReviewing(null)
      setReviewAction(null)
      fetchVerifications()
    } catch (err: any) {
      alert(`Error: ${err.message}`)
      setReviewing(null)
      setReviewAction(null)
    }
  }

  if (authStatus === 'loading' || loading) {
    return (
      <div className="p-8">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Student Verifications</h1>

      {/* Status Filter */}
      <div className="mb-6 flex gap-2">
        {['PENDING', 'APPROVED', 'REJECTED', 'EXPIRED', 'ALL'].map((status) => (
          <button
            key={status}
            className={`btn btn-sm ${statusFilter === status ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setStatusFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {/* Verifications List */}
      <div className="space-y-4">
        {verifications.length === 0 ? (
          <p className="text-center py-8 text-base-content/60">
            No {statusFilter.toLowerCase()} verifications found
          </p>
        ) : (
          verifications.map((v) => (
            <div key={v.id} className="card bg-base-200 shadow-lg">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="card-title">
                      {v.user.name || 'Unknown'} ({v.user.email})
                    </h3>
                    <div className="text-sm space-y-1 mt-2">
                      <p>
                        <strong>Institution:</strong> {v.institutionName} ({v.country})
                      </p>
                      <p>
                        <strong>Method:</strong> {v.method}
                      </p>
                      {v.schoolEmail && (
                        <p>
                          <strong>School Email:</strong> {v.schoolEmail}
                        </p>
                      )}
                      {v.evidenceUrl && (
                        <p>
                          <strong>Evidence:</strong>{' '}
                          <a
                            href={v.evidenceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link"
                          >
                            View Document
                          </a>
                        </p>
                      )}
                      <p>
                        <strong>Type:</strong>{' '}
                        {v.discountType === 'YOUTH_13_18' ? 'Youth (13-18)' : 'Student (18+)'}
                      </p>
                      {v.guardianEmail && (
                        <p>
                          <strong>Guardian:</strong> {v.guardianEmail} (Consent:{' '}
                          {v.guardianConsent ? 'Yes' : 'No'})
                        </p>
                      )}
                      <p>
                        <strong>Submitted:</strong>{' '}
                        {new Date(v.createdAt).toLocaleString()}
                      </p>
                      {v.reviewedAt && (
                        <p>
                          <strong>Reviewed:</strong>{' '}
                          {new Date(v.reviewedAt).toLocaleString()}
                        </p>
                      )}
                      {v.notes && (
                        <p>
                          <strong>Notes:</strong> {v.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <span
                      className={`badge ${
                        v.status === 'APPROVED'
                          ? 'badge-success'
                          : v.status === 'PENDING'
                          ? 'badge-warning'
                          : 'badge-error'
                      }`}
                    >
                      {v.status}
                    </span>
                  </div>
                </div>

                {/* Review Actions (only for PENDING) */}
                {v.status === 'PENDING' && (
                  <div className="mt-4 border-t pt-4">
                    <label className="label">
                      <span className="label-text font-semibold">Review Notes</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered w-full"
                      placeholder="Optional notes for approval or required reason for rejection"
                      value={reviewing === v.id ? reviewNotes : ''}
                      onChange={(e) => {
                        setReviewing(v.id)
                        setReviewNotes(e.target.value)
                      }}
                      rows={2}
                    />

                    <div className="flex gap-2 mt-3">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleReview(v.id, 'approve')}
                        disabled={reviewing === v.id && reviewAction !== null}
                      >
                        {reviewing === v.id && reviewAction === 'approve'
                          ? 'Approving...'
                          : 'Approve (12 months)'}
                      </button>
                      <button
                        className="btn btn-error btn-sm"
                        onClick={() => {
                          if (!reviewNotes.trim()) {
                            alert('Please provide a rejection reason')
                            return
                          }
                          handleReview(v.id, 'reject')
                        }}
                        disabled={reviewing === v.id && reviewAction !== null}
                      >
                        {reviewing === v.id && reviewAction === 'reject'
                          ? 'Rejecting...'
                          : 'Reject'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
