'use client'

export const dynamic = 'force-dynamic'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Download, ArrowRight, Package, Clock, AlertTriangle } from 'lucide-react'
import DashboardCard from '@/components/features/dashboard/DashboardCard'
import { useToast } from '@/components/ui/Toast'
import { Spinner } from '@/components/ui/Spinner'
interface DashboardStats {
  totalDownloads: number
}
interface RecentDownload {
  slug: string
  name: string
  category: string
  downloadedAt: string
}
interface MeSummaryResponse {
  success: boolean
  data?: {
    user: {
      id: string
      name: string | null
      email: string
    }
    stats: {
      licensesCount: number
    }
    recentDownloads: RecentDownload[]
  }
}
export default function DashboardPage() {
  const { data: session } = useSession()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalDownloads: 0,
  })
  const [recentDownloads, setRecentDownloads] = useState<RecentDownload[]>([])
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/me/summary', {
        method: 'GET',
      })
      if (!response.ok) {
        throw new Error('Failed to load dashboard summary')
      }
      const json = (await response.json()) as MeSummaryResponse
      if (!json.success || !json.data) {
        throw new Error('Failed to load dashboard summary')
      }
      setStats({
        totalDownloads: json.data.stats.licensesCount,
      })
      setRecentDownloads(json.data.recentDownloads || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      showToast('Failed to load dashboard data', 'error')
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }, [showToast])
  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }
  const greetingName = (() => {
    const name = session?.user?.name?.trim()
    if (name) return name.split(' ')[0]
    const email = session?.user?.email?.trim()
    if (email) {
      const [localPart] = email.split('@')
      return localPart || email
    }
    return 'there'
  })()
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }
  return (
    <div className="space-y-8 max-w-7xl">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome back, {greetingName} 👋🏾
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your account activity
        </p>
        {error && (
          <p className="mt-2 text-sm text-muted-foreground">
            {error}
          </p>
        )}
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Download className="text-primary" size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Downloads Owned</p>
              <p className="text-3xl font-bold text-foreground">{stats.totalDownloads}</p>
            </div>
          </div>
        </DashboardCard>
        <DashboardCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-warning/10 rounded-lg">
              <Clock className="text-warning" size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Recent Downloads</p>
              <p className="text-3xl font-bold text-foreground">{recentDownloads.length}</p>
            </div>
          </div>
        </DashboardCard>
      </div>
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/products"
          className="group"
        >
          <DashboardCard className="p-8 border-2 border-primary/20 hover:border-primary/40 hover:shadow-lg transition-all">
            <Package size={32} className="mb-4 text-primary" />
            <h3 className="text-xl font-bold text-foreground mb-2">Browse the Shop</h3>
            <p className="text-muted-foreground mb-4">
              Explore digital products and pick up your next download.
            </p>
            <span className="inline-flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
              Visit Shop <ArrowRight size={20} />
            </span>
          </DashboardCard>
        </Link>
        <Link
          href="/complaints"
          className="group"
        >
          <DashboardCard className="p-8 border-2 border-primary/20 hover:border-primary/40 hover:shadow-lg transition-all">
            <AlertTriangle size={32} className="mb-4 text-primary" />
            <h3 className="text-xl font-bold text-foreground mb-2">Submit a Complaint</h3>
            <p className="text-muted-foreground mb-4">
              Report access issues, license concerns, or policy questions.
            </p>
            <span className="inline-flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
              Open Form <ArrowRight size={20} />
            </span>
          </DashboardCard>
        </Link>
      </div>
      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-8">
        {/* Recent Downloads */}
        <DashboardCard
          title="Recent Downloads"
          rightSlot={
            recentDownloads.length > 0 ? (
              <Link
                href="/dashboard/downloads"
                className="text-sm text-primary hover:underline font-medium"
              >
                View all
              </Link>
            ) : null
          }
        >
          {recentDownloads.length === 0 ? (
            <div className="text-center py-12">
              <Download className="mx-auto mb-4 text-muted-foreground" size={48} />
              <p className="text-muted-foreground mb-4">No downloads yet</p>
              <Link
                href="/products"
                className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
              >
                Browse Shop
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentDownloads.map((download) => (
                <Link
                  key={download.slug}
                  href={`/dashboard/downloads/${download.slug}`}
                  className="block p-4 bg-muted rounded-lg hover:bg-muted/70 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground mb-1">{download.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {download.category.replace('_', ' ')}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(download.downloadedAt)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </DashboardCard>
      </div>
    </div>
  )
}
