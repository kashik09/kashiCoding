'use client'

import { usePreferences } from '@/lib/preferences/PreferencesContext'
import { HeroFormal } from './HeroFormal'
import { HeroVibey } from './HeroVibey'

interface HeroSwitchProps {
  title: string
  highlight: string
  subtitle: string
  primaryCtaLabel: string
  primaryCtaHref: string
  secondaryCtaLabel: string
  secondaryCtaHref: string
}

export function HeroSwitch(props: HeroSwitchProps) {
  const { preferences } = usePreferences()

  if (preferences.mode === 'vibey') {
    return <HeroVibey {...props} />
  }

  return <HeroFormal {...props} />
}
