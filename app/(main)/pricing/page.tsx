'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

type FrequencyId = 'weekly' | 'monthly' | 'quarterly' | 'yearly'

const frequencies: Array<{
  id: FrequencyId
  label: string
  description: string
}> = [
  { id: 'weekly', label: 'Weekly', description: '+15% flexibility premium' },
  { id: 'monthly', label: 'Monthly', description: 'Standard billing' },
  { id: 'quarterly', label: 'Quarterly', description: 'Discounted' },
  { id: 'yearly', label: 'Yearly', description: 'Best value' },
]

const tiers = {
  personal: [
    { name: 'Basic', monthlyPrice: 29, credits: 10 },
    { name: 'Pro', monthlyPrice: 79, credits: 30 },
  ],
  team: [
    { name: 'Small Team', monthlyPrice: 199, credits: 80 },
    { name: 'Large Team', monthlyPrice: 349, credits: 150 },
  ],
  student: [
    { name: 'Student Basic', monthlyPrice: 15, credits: 10 },
    { name: 'Student Pro', monthlyPrice: 39, credits: 30 },
  ],
}

function formatPrice(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function computePrice(monthlyPrice: number, frequency: FrequencyId) {
  switch (frequency) {
    case 'weekly':
      return (monthlyPrice * 1.15) / 4
    case 'quarterly':
      return monthlyPrice * 3 * 0.86
    case 'yearly':
      return monthlyPrice * 12 * 0.78
    case 'monthly':
    default:
      return monthlyPrice
  }
}

function frequencyLabel(frequency: FrequencyId) {
  switch (frequency) {
    case 'weekly':
      return 'week'
    case 'quarterly':
      return 'quarter'
    case 'yearly':
      return 'year'
    default:
      return 'month'
  }
}

export default function PricingPage() {
  const [activeFrequency, setActiveFrequency] = useState<FrequencyId>('monthly')

  const sections = useMemo(
    () => [
      {
        title: 'Personal plans',
        description: 'For solo builders who want predictable credits and scope boundaries.',
        items: tiers.personal,
      },
      {
        title: 'Team plans',
        description: 'For small teams that need reliable service capacity and priority support.',
        items: tiers.team,
      },
      {
        title: 'Student plans (13-18)',
        description: '50% off personal plans with verification and stricter scope limits.',
        items: tiers.student,
      },
    ],
    []
  )

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 space-y-16">
        <section className="text-center max-w-3xl mx-auto space-y-6">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Pricing</p>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Credits-based support with clear boundaries
          </h1>
          <p className="text-lg text-muted-foreground">
            Credits are prepaid service units for fixes, tweaks, and scoped work. They are not money, not hours, and not unlimited.
          </p>
        </section>

        <section className="flex flex-wrap justify-center gap-3">
          {frequencies.map((frequency) => (
            <button
              key={frequency.id}
              type="button"
              onClick={() => setActiveFrequency(frequency.id)}
              className={`px-4 py-2 rounded-full border text-sm transition ${
                activeFrequency === frequency.id
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-muted-foreground hover:border-primary/50'
              }`}
            >
              <span className="font-semibold">{frequency.label}</span>
              <span className="ml-2 text-xs opacity-80">{frequency.description}</span>
            </button>
          ))}
        </section>

        {sections.map((section) => (
          <section key={section.title} className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-foreground">{section.title}</h2>
              <p className="text-muted-foreground">{section.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.items.map((tier) => {
                const price = computePrice(tier.monthlyPrice, activeFrequency)
                return (
                  <div
                    key={tier.name}
                    className="bg-card border border-border rounded-2xl p-6 space-y-4"
                  >
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">{tier.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {tier.credits} credits per month
                      </p>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-foreground">
                        {formatPrice(price)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        / {frequencyLabel(activeFrequency)}
                      </span>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>Scope confirmed before work starts.</li>
                      <li>Credits expire by plan terms.</li>
                      <li>Scope changes require extra credits.</li>
                    </ul>
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center w-full py-2.5 rounded-lg border border-border hover:border-primary/60 transition font-semibold"
                    >
                      Start a request
                    </Link>
                  </div>
                )
              })}
            </div>
          </section>
        ))}

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h3 className="text-xl font-semibold text-foreground">Credits reality</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>Small fixes are typically 2-4 credits.</li>
              <li>Credits issue monthly regardless of billing frequency.</li>
              <li>Credits are for scoped service work only.</li>
              <li>Credits are not currency and have no cash value.</li>
            </ul>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h3 className="text-xl font-semibold text-foreground">Payment reality</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>Billing is manual right now.</li>
              <li>No refunds after purchase or payment.</li>
              <li>Enterprise pricing is quote-only.</li>
            </ul>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h3 className="text-xl font-semibold text-foreground">Enterprise</h3>
            <p className="text-sm text-muted-foreground">
              6+ seats, redistribution, white-label, or complex systems require a custom agreement.
            </p>
            <Link
              href="/enterprise"
              className="inline-flex items-center justify-center w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition"
            >
              Contact for quote
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
