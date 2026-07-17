'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface SiteStatusResponse {
  success: boolean
  data?: {
    maintenanceMode: boolean
    availableForBusiness: boolean
    adsEnabled: boolean
  }
}

interface AdConsentResponse {
  success: boolean
  data?: {
    personalizedAds: boolean
  }
}

export function CookieNotice() {
  const [isVisible, setIsVisible] = useState(false)
  const [adsEnabled, setAdsEnabled] = useState(false)
  const [personalizedAds, setPersonalizedAds] = useState(false)
  const [updatingAdsConsent, setUpdatingAdsConsent] = useState(false)
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false)

  useEffect(() => {
    const acknowledged = typeof window !== 'undefined'
      ? localStorage.getItem('cookieNoticeAcknowledged')
      : null

    if (!acknowledged) {
      setTimeout(() => setIsVisible(true), 500)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem('cookieConsentAnalytics')
    setAnalyticsEnabled(stored === 'true')
  }, [])

  useEffect(() => {
    let cancelled = false

    async function fetchSiteStatus() {
      try {
        const res = await fetch('/api/site/status', {
          method: 'GET',
        })

        if (!res.ok) return

        const json = (await res.json()) as SiteStatusResponse
        if (!cancelled && json.success && json.data) {
          setAdsEnabled(Boolean(json.data.adsEnabled))
        }
      } catch {
        // Silently ignore - banner should never block usage
      }
    }

    async function fetchAdConsent() {
      try {
        const res = await fetch('/api/me/ad-consent', {
          method: 'GET',
        })

        if (!res.ok) return

        const json = (await res.json()) as AdConsentResponse
        if (!cancelled && json.success && json.data) {
          setPersonalizedAds(Boolean(json.data.personalizedAds))
        }
      } catch {
        // Silently ignore - treat as no personalized ads consent
      }
    }

    fetchSiteStatus()
    fetchAdConsent()

    return () => {
      cancelled = true
    }
  }, [])

  const handleDismiss = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cookieNoticeAcknowledged', 'true')
    }
    setIsVisible(false)
  }

  const handleToggleAnalytics = () => {
    const nextValue = !analyticsEnabled
    setAnalyticsEnabled(nextValue)

    if (typeof window !== 'undefined') {
      localStorage.setItem('cookieConsentAnalytics', nextValue ? 'true' : 'false')
      window.dispatchEvent(new Event('analytics-consent'))
    }
  }

  const handleTogglePersonalizedAds = async () => {
    const nextValue = !personalizedAds

    setPersonalizedAds(nextValue)
    setUpdatingAdsConsent(true)

    try {
      await fetch('/api/me/ad-consent', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ personalizedAds: nextValue }),
      })
    } catch {
      // If the request fails (e.g., not signed in), keep local preference only
    } finally {
      setUpdatingAdsConsent(false)
    }
  }

  if (!isVisible) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4"
      onClick={handleDismiss}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-card border border-border shadow-lg text-foreground"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Cookies & site data</h3>
            <p className="text-sm text-muted-foreground">
              We use essential cookies to keep the site working (such as login and security).
              We may also use limited analytics to understand usage and improve the site.
              If ads are enabled, you can control whether we use your data for personalized ads.
            </p>
          </div>
          <button
            type="button"
            onClick={handleDismiss}
            className="rounded-md border border-border bg-card px-2 py-1 text-base-content hover:bg-muted"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col gap-4 px-6 py-5">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-4">
              <h4 className="font-semibold text-foreground">Essential</h4>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-foreground">
                Always on
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Required for authentication, security, and core site features.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="font-semibold text-foreground">Analytics</h4>
                <p className="text-sm text-muted-foreground">
                  Helps us understand site usage so we can improve the experience.
                </p>
              </div>
              <button
                type="button"
                onClick={handleToggleAnalytics}
                className={`rounded-lg border border-border px-4 py-2 text-sm font-medium ${
                  analyticsEnabled ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
                }`}
              >
                Analytics: {analyticsEnabled ? 'On' : 'Off'}
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="font-semibold text-foreground">Ads</h4>
                <p className="text-sm text-muted-foreground">
                  Control whether ads can use your data for personalization.
                </p>
              </div>
              {adsEnabled && (
                <button
                  type="button"
                  onClick={handleTogglePersonalizedAds}
                  disabled={updatingAdsConsent}
                  className={`rounded-lg border border-border px-4 py-2 text-sm font-medium ${
                    personalizedAds ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
                  }`}
                >
                  Personalized ads: {personalizedAds ? 'On' : 'Off'}
                </button>
              )}
            </div>

            {!adsEnabled && (
              <div className="mt-3 rounded-lg border border-border bg-muted px-4 py-3 opacity-70 cursor-not-allowed">
                <p className="text-sm font-medium text-foreground">Ads preferences</p>
                <p className="text-sm text-muted-foreground">
                  Not available yet. You’ll be able to choose ad preferences when ads are enabled.
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <Link
              href="/legal/privacy-policy"
              className="text-sm text-primary hover:underline font-medium"
            >
              Learn more
            </Link>
            <button
              onClick={handleDismiss}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium whitespace-nowrap"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
