'use client'

export const dynamic = 'force-dynamic'
import { useEffect, useMemo, useState } from 'react'
import {
  BarChart3,
  Clock,
  Eye,
  Monitor,
  MousePointer,
  Smartphone,
  Tablet,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Spinner } from '@/components/ui/Spinner'
interface AnalyticsData {
  totalViews: number
  uniqueVisitors: number
  avgTimeOnSite: number
  topPages: { page: string; views: number }[]
  devices: { type: string; count: number }[]
  popularProjects: { title: string; views: number }[]
  recentEvents: { action: string; timestamp: string; data: any }[]
}
type Range = '24h' | '7d' | '30d' | 'all'
function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode
  label: string
  value: string
  sub?: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-3">
        <div className="rounded-lg border border-border bg-background p-2 text-primary">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="text-2xl font-semibold text-foreground">{value}</div>
          {sub ? <div className="text-xs text-muted-foreground">{sub}</div> : null}
        </div>
      </div>
    </div>
  )
}
function PillButton({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={[
        'rounded-full px-4 py-2 text-sm font-medium transition',
        'border border-border',
        active
          ? 'bg-primary text-primary-content border-primary'
          : 'bg-card text-foreground hover:bg-background',
      ].join(' ')}
      type="button"
    >
      {children}
    </button>
  )
}
function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}m ${secs}s`
}
function deviceIcon(type: string) {
  switch (type) {
    case 'desktop':
      return <Monitor size={18} />
    case 'mobile':
      return <Smartphone size={18} />
    case 'tablet':
      return <Tablet size={18} />
    default:
      return <Monitor size={18} />
  }
}
export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<Range>('7d')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  useEffect(() => {
    let cancelled = false
    async function fetchAnalytics() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`/api/admin/analytics?range=${timeRange}`, { cache: 'no-store' })
        const json = await res.json().catch(() => null)
        if (!res.ok) {
          throw new Error((json && (json.error || json.message)) || 'Failed to fetch analytics data')
        }
        if (!json?.success || !json?.data) {
          throw new Error((json && json.error) || 'Failed to load analytics')
        }
        if (!cancelled) setAnalytics(json.data as AnalyticsData)
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Failed to load analytics'
        if (!cancelled) setError(msg)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchAnalytics()
    return () => {
      cancelled = true
    }
  }, [timeRange])
  const rangeLabel = useMemo(() => {
    switch (timeRange) {
      case '24h':
        return '24 Hours'
      case '7d':
        return '7 Days'
      case '30d':
        return '30 Days'
      default:
        return 'All Time'
    }
  }, [timeRange])
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }
  if (error) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card p-6">
        <p className="text-center text-lg font-semibold text-foreground">Analytics failed to load</p>
        <p className="text-center text-sm text-muted-foreground">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-content transition hover:opacity-90"
          type="button"
        >
          Retry
        </button>
      </div>
    )
  }
  if (!analytics) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">No analytics data available</p>
      </div>
    )
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground">Range: {rangeLabel}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(['24h', '7d', '30d', 'all'] as const).map((r) => (
            <PillButton key={r} active={timeRange === r} onClick={() => setTimeRange(r)}>
              {r === '24h' ? '24 Hours' : r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : 'All Time'}
            </PillButton>
          ))}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<Eye size={20} />} label="Total views" value={String(analytics.totalViews)} />
        <StatCard icon={<Users size={20} />} label="Unique visitors" value={String(analytics.uniqueVisitors)} />
        <StatCard icon={<Clock size={20} />} label="Avg time on site" value={formatTime(analytics.avgTimeOnSite)} />
        <StatCard icon={<TrendingUp size={20} />} label="Signal" value="OK" sub="Basic telemetry" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center gap-2 text-foreground">
            <BarChart3 size={18} className="text-primary" />
            <h2 className="text-lg font-semibold">Top pages</h2>
          </div>
          <div className="space-y-2">
            {(analytics.topPages || []).slice(0, 8).map((p) => (
              <div
                key={p.page}
                className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2"
              >
                <div className="truncate text-sm text-foreground">{p.page}</div>
                <div className="text-sm font-semibold text-foreground">{p.views}</div>
              </div>
            ))}
            {!analytics.topPages?.length ? (
              <p className="text-sm text-muted-foreground">No page data.</p>
            ) : null}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center gap-2 text-foreground">
            <MousePointer size={18} className="text-primary" />
            <h2 className="text-lg font-semibold">Devices</h2>
          </div>
          <div className="space-y-2">
            {(analytics.devices || []).slice(0, 8).map((d) => (
              <div
                key={d.type}
                className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2"
              >
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <span className="text-primary">{deviceIcon(d.type)}</span>
                  <span className="capitalize">{d.type}</span>
                </div>
                <div className="text-sm font-semibold text-foreground">{d.count}</div>
              </div>
            ))}
            {!analytics.devices?.length ? (
              <p className="text-sm text-muted-foreground">No device data.</p>
            ) : null}
          </div>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="mb-3 text-lg font-semibold text-foreground">Popular projects</h2>
          <div className="space-y-2">
            {(analytics.popularProjects || []).slice(0, 8).map((p) => (
              <div
                key={p.title}
                className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2"
              >
                <div className="truncate text-sm text-foreground">{p.title}</div>
                <div className="text-sm font-semibold text-foreground">{p.views}</div>
              </div>
            ))}
            {!analytics.popularProjects?.length ? (
              <p className="text-sm text-muted-foreground">No project data.</p>
            ) : null}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="mb-3 text-lg font-semibold text-foreground">Recent events</h2>
          <div className="space-y-2">
            {(analytics.recentEvents || []).slice(0, 10).map((e, idx) => (
              <div
                key={`${e.action}-${e.timestamp}-${idx}`}
                className="rounded-lg border border-border bg-background px-3 py-2"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="truncate text-sm font-medium text-foreground">{e.action}</div>
                  <div className="shrink-0 text-xs text-muted-foreground">{e.timestamp}</div>
                </div>
              </div>
            ))}
            {!analytics.recentEvents?.length ? (
              <p className="text-sm text-muted-foreground">No recent events.</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
