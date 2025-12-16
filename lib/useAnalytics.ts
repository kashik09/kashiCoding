'use client'

import { useEffect } from 'react'
import { track } from '@vercel/analytics'

interface PageViewData {
  page: string
  referrer?: string
  device?: string
}

interface EventData {
  action: string
  category: string
  label?: string
  value?: number
}

export function useAnalytics() {
  // Track page view
  const trackPageView = (data: PageViewData) => {
    track('page_view', {
      page: data.page,
      referrer: data.referrer || document.referrer,
      device: getDeviceType(),
      timestamp: new Date().toISOString()
    })
  }

  // Track custom events
  const trackEvent = (data: EventData) => {
    track(data.action, {
      category: data.category,
      label: data.label,
      value: data.value,
      timestamp: new Date().toISOString()
    })
  }

  // Track project view
  const trackProjectView = (projectId: string, projectTitle: string) => {
    track('project_view', {
      projectId,
      projectTitle,
      device: getDeviceType(),
      timestamp: new Date().toISOString()
    })
  }

  // Track button clicks
  const trackClick = (buttonName: string, location: string) => {
    track('button_click', {
      buttonName,
      location,
      timestamp: new Date().toISOString()
    })
  }

  // Track form submissions
  const trackFormSubmit = (formName: string, success: boolean) => {
    track('form_submit', {
      formName,
      success,
      timestamp: new Date().toISOString()
    })
  }

  // Track downloads
  const trackDownload = (fileName: string, fileType: string) => {
    track('download', {
      fileName,
      fileType,
      timestamp: new Date().toISOString()
    })
  }

  // Track theme changes
  const trackThemeChange = (themeName: string) => {
    track('theme_change', {
      themeName,
      timestamp: new Date().toISOString()
    })
  }

  // Helper: Get device type
  const getDeviceType = () => {
    const ua = navigator.userAgent
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet'
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return 'mobile'
    }
    return 'desktop'
  }

  return {
    trackPageView,
    trackEvent,
    trackProjectView,
    trackClick,
    trackFormSubmit,
    trackDownload,
    trackThemeChange,
  }
}

// Hook to automatically track page views
export function usePageTracking(pageName: string) {
  const { trackPageView } = useAnalytics()

  useEffect(() => {
    trackPageView({
      page: pageName,
      referrer: document.referrer,
      device: navigator.userAgent
    })

    // Track time on page
    const startTime = Date.now()
    
    return () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000) // in seconds
      track('time_on_page', {
        page: pageName,
        seconds: timeSpent,
        timestamp: new Date().toISOString()
      })
    }
  }, [pageName, trackPageView])
}
