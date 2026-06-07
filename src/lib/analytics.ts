import posthog from 'posthog-js'

let ready = false

export function initAnalytics() {
  const key = import.meta.env.VITE_PUBLIC_POSTHOG_KEY
  const host = import.meta.env.VITE_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com'
  if (!key || ready) return

  posthog.init(key, {
    api_host: host,
    person_profiles: 'identified_only',
    capture_pageview: true,
    capture_pageleave: true,
  })
  ready = true
}

export function trackEvent(name: string, props?: Record<string, string | number | boolean>) {
  if (!ready) return
  posthog.capture(name, props)
}

export function isAnalyticsEnabled() {
  return ready
}
