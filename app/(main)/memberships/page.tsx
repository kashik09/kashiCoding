'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Check, Star, ArrowRight, Sparkles } from 'lucide-react'
import { MEMBERSHIP_PLANS } from '@/lib/membership-plans'
import { useToast } from '@/components/ui/Toast'
import { Spinner } from '@/components/ui/Spinner'

export default function MembershipsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { showToast } = useToast()
  const [loading, setLoading] = useState<string | null>(null)

  const handlePurchase = async (tierName: string) => {
    if (status !== 'authenticated') {
      showToast('Please login to purchase a membership', 'error')
      router.push('/login')
      return
    }

    setLoading(tierName)

    try {
      const response = await fetch('/api/memberships/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tier: tierName }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to purchase membership')
      }

      showToast('Membership purchased successfully!', 'success')
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Error purchasing membership:', error)
      showToast(error.message || 'Failed to purchase membership', 'error')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
            <Sparkles className="text-primary" size={16} />
            <span className="text-sm text-primary font-medium">Choose Your Plan</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground">
            Select a membership plan that fits your needs. All plans include credits for services and rollover unused credits.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {MEMBERSHIP_PLANS.map((plan) => (
            <div
              key={plan.tier}
              className={`relative bg-card rounded-2xl border-2 p-8 transition-all ${
                plan.popular
                  ? 'border-primary shadow-xl scale-105'
                  : 'border-border hover:border-primary/50 hover:shadow-lg'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1 px-4 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                    <Star size={14} fill="currentColor" />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold text-foreground">${plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </div>

              {/* Credits Info */}
              <div className="bg-muted rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Monthly Credits</span>
                  <span className="text-lg font-bold text-foreground">{plan.credits}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Rollover Cap</span>
                  <span className="text-sm font-medium text-foreground">Up to {plan.rolloverCap}</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="text-primary flex-shrink-0 mt-0.5" size={18} />
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handlePurchase(plan.tier)}
                disabled={loading === plan.tier}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  plan.popular
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md'
                    : 'bg-card border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground'
                }`}
              >
                {loading === plan.tier ? (
                  <Spinner size="sm" />
                ) : (
                  <>
                    Get Started
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-bold text-foreground mb-2">What are credits?</h3>
              <p className="text-muted-foreground">
                Credits are used to access services on the platform. Different services consume different amounts of credits based on complexity and time required.
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-bold text-foreground mb-2">What happens to unused credits?</h3>
              <p className="text-muted-foreground">
                Unused credits can roll over to the next month up to your plan's rollover cap. This ensures you don't lose credits if you don't use them all in a given month.
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-bold text-foreground mb-2">Can I upgrade or downgrade my plan?</h3>
              <p className="text-muted-foreground">
                Yes! You can change your plan at any time. Contact support for assistance with plan changes, and we'll help you transition smoothly.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            Need a custom plan or have questions?
          </p>
          <Link
            href="/request"
            className="inline-flex items-center gap-2 px-6 py-3 bg-card border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition font-medium"
          >
            Contact Us
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  )
}
