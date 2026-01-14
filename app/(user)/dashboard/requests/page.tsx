'use client'

export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FileText, Plus, AlertCircle } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'
import { Spinner } from '@/components/ui/Spinner'
interface UserRequest {
  id: string
  projectType: string
  status: string
  createdAt: string
}
interface MeRequestsResponse {
  success: boolean
  data?: {
    requests: UserRequest[]
  }
}
interface SiteStatusResponse {
  success: boolean
  data?: {
    maintenanceMode: boolean
    availableForBusiness: boolean
  }
}
function getStatusBadgeClasses(status: string) {
  switch (status) {
    case 'PENDING':
      return 'bg-warning/20 text-warning border border-warning/30'
    case 'ACCEPTED':
    case 'REVIEWING':
    case 'IN_PROGRESS':
      return 'bg-info/20 text-info border border-info/30'
    case 'COMPLETED':
      return 'bg-success/20 text-success border border-success/30'
    case 'REJECTED':
    case 'CANCELLED':
      return 'bg-destructive/20 text-destructive border border-destructive/30'
    default:
      return 'bg-primary/20 text-primary border border-primary/30'
  }
}
function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
export default function RequestsPage() {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [requests, setRequests] = useState<UserRequest[]>([])
  const [availableForBusiness, setAvailableForBusiness] = useState(true)
  useEffect(() => {
    let cancelled = false
    async function loadData() {
      try {
        setLoading(true)
        const [requestsRes, statusRes] = await Promise.all([
          fetch('/api/me/requests'),
          fetch('/api/site/status'),
        ])
        if (requestsRes.ok) {
          const json = (await requestsRes.json()) as MeRequestsResponse
          if (!cancelled && json.success && json.data) {
            setRequests(json.data.requests || [])
          }
        } else {
          throw new Error('Failed to load requests')
        }
        if (statusRes.ok) {
          const statusJson = (await statusRes.json()) as SiteStatusResponse
          if (!cancelled && statusJson.success && statusJson.data) {
            setAvailableForBusiness(
              Boolean(statusJson.data.availableForBusiness)
            )
          }
        }
      } catch (error) {
        console.error('Error loading requests:', error)
        if (!cancelled) {
          showToast('Failed to load requests', 'error')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }
    loadData()
    return () => {
      cancelled = true
    }
  }, [showToast])
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }
  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            My Requests
          </h1>
          <p className="text-muted-foreground">
            Track the status of your project requests.
          </p>
        </div>
        <Link
          href={availableForBusiness ? '/request' : '#'}
          aria-disabled={!availableForBusiness}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium border border-border ${
            availableForBusiness
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          <Plus size={18} />
          New Request
        </Link>
      </div>
      {!availableForBusiness && (
        <div className="flex items-start gap-3 bg-muted border border-border rounded-lg p-4">
          <AlertCircle className="text-muted-foreground mt-0.5" size={18} />
          <div>
            <p className="font-medium text-foreground">
              Currently not accepting new projects
            </p>
            <p className="text-sm text-muted-foreground">
              You can still view your existing requests below, but new
              submissions are temporarily disabled.
            </p>
          </div>
        </div>
      )}
      {requests.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-12 text-center">
          <FileText
            className="mx-auto mb-4 text-muted-foreground"
            size={64}
          />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            No requests yet
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            When you submit a project request, it will appear here so you can
            track its status.
          </p>
          <Link
            href="/request"
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium ${
              availableForBusiness
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
            aria-disabled={!availableForBusiness}
          >
            <Plus size={18} />
            Submit a Request
          </Link>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="space-y-3">
            {requests.map(request => (
              <Link
                key={request.id}
                href={`/dashboard/requests/${request.id}`}
                className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/70 transition"
              >
                <div>
                  <p className="font-medium text-foreground">
                    {request.projectType}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Submitted on {formatDate(request.createdAt)}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusBadgeClasses(
                    request.status
                  )}`}
                >
                  {request.status.replace('_', ' ')}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
