'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Wrench, Layers, ShieldCheck, MessageSquare, CheckCircle } from 'lucide-react'
import { Spinner } from '@/components/ui/Spinner'

type Service = {
  id: string
  name: string
  icon: any
  description: string
  price: string
  features: string[]
}

type AvailabilityData = {
  status: string
  message: string | null
}

export default function ServicesPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAvailable, setIsAvailable] = useState(true)
  const [availability, setAvailability] = useState<AvailabilityData | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/site/status').then((r) => r.json()),
      fetch('/api/site/availability').then((r) => r.json()),
    ])
      .then(([statusData, availabilityData]) => {
        setIsAvailable(statusData.data?.availableForBusiness !== false)
        if (availabilityData.success && availabilityData.data) {
          setAvailability(availabilityData.data)
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const services: Service[] = [
    {
      id: 'credit-fixes',
      name: 'Credit-Based Fixes',
      icon: Wrench,
      description: 'Tight, reversible improvements and bug fixes with clear scope and fast turnaround.',
      price: '2-6 credits',
      features: [
        'Small fixes (2-4 credits)',
        'Scoped tweaks and polish',
        'Defined acceptance criteria',
        'No open-ended work',
      ],
    },
    {
      id: 'scoped-builds',
      name: 'Scoped Builds',
      icon: Layers,
      description: 'Focused builds with a fixed deliverable: landing pages, flows, or compact features.',
      price: '6-24 credits',
      features: [
        'Clear scope + timeline',
        'Design + build options',
        'One-off cash payment allowed',
        'Scope changes cost extra',
      ],
    },
    {
      id: 'living-systems',
      name: 'Living System Support',
      icon: ShieldCheck,
      description: 'Ongoing support for auth, dashboards, e-commerce, RBAC, and data-heavy apps.',
      price: 'Subscription or retainer',
      features: [
        'Subscription strongly required',
        'Priority support buckets',
        'Proactive maintenance',
        'Monthly planning calls',
      ],
    },
    {
      id: 'consulting',
      name: 'Consulting & Reviews',
      icon: MessageSquare,
      description: 'Architecture reviews, audits, and technical direction with clear outcomes.',
      price: 'Scoped credits',
      features: [
        'Audit summaries + action plan',
        'Roadmap guidance',
        'Performance and security reviews',
        'Decision support',
      ],
    },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-6">Services</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Services run on credits and clear scope. Credits are prepaid service units, not money and not hours. Bigger, living systems are supported best through subscriptions or retainers.
          </p>
        </div>

        {/* Availability Status */}
        {availability && availability.status !== 'AVAILABLE' && (
          <div className="max-w-4xl mx-auto mb-12">
            <div className={`rounded-xl p-4 border ${
              availability.status === 'UNAVAILABLE'
                ? 'bg-error/10 border-error/20'
                : 'bg-warning/10 border-warning/20'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`badge badge-sm ${
                  availability.status === 'UNAVAILABLE'
                    ? 'badge-error'
                    : 'badge-warning'
                }`}>
                  {availability.status === 'UNAVAILABLE' ? 'Unavailable' : 'Limited Availability'}
                </div>
                {availability.message && (
                  <p className={`text-sm ${
                    availability.status === 'UNAVAILABLE'
                      ? 'text-error'
                      : 'text-warning'
                  }`}>
                    {availability.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        {availability && availability.status === 'AVAILABLE' && availability.message && (
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-success/10 border border-success/20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="badge badge-sm badge-success">Available</div>
                <p className="text-sm text-success">
                  {availability.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <div
                key={service.id}
                className="bg-card rounded-xl border border-border p-8 hover:border-primary/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">{service.price}</p>
                </div>
                </div>

                <h3 className="text-2xl font-bold text-foreground mb-3">{service.name}</h3>
                <p className="text-muted-foreground mb-6">{service.description}</p>

                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-12 border border-primary/20">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {isAvailable ? 'Ready to scope your work?' : 'Want to reserve a slot?'}
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              {isAvailable
                ? 'Share your request and we will confirm scope, credit usage, and timeline before anything starts.'
                : 'Send your details and I will follow up when availability opens.'}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold text-lg"
              >
                Get in Touch
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-8 py-4 border border-border rounded-lg hover:border-primary/60 transition-colors font-semibold text-lg"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>

        {/* Process Section */}
        <div className="max-w-4xl mx-auto mt-24 space-y-10">
          <h2 className="text-3xl font-bold text-foreground text-center">How credits work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground">
            <div className="bg-card border border-border rounded-xl p-6 space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Small fix examples</h3>
              <ul className="space-y-2">
                <li>Bug fix or UI polish: 2-4 credits</li>
                <li>New section or page: 3-6 credits</li>
                <li>Performance tuning pass: 4-6 credits</li>
              </ul>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Boundaries</h3>
              <ul className="space-y-2">
                <li>Credits only cover agreed scope.</li>
                <li>Scope changes cost extra credits.</li>
                <li>Living systems require subscription support.</li>
                <li>Cash one-off payments can still be approved.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
