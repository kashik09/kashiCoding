'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { CheckCircle, Star, Zap, Crown, ArrowRight } from 'lucide-react'
import { Spinner } from '@/components/ui/Spinner'
import { useToast } from '@/components/ui/Toast'

type MembershipTier = {
  id: string
  name: string
  tier: 'BASIC_ACCESS' | 'PRO' | 'MANAGED'
  price: string
  credits: number
  duration: string
  icon: any
  popular?: boolean
  features: string[]
  description: string
}

export default function MembershipsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [pricing, setPricing] = useState<any>(null)
  const [purchasing, setPurchasing] = useState<string | null>(null)
  const { data: session } = useSession()
  const router = useRouter()
  const { showToast } = useToast()

  useEffect(() => {
    fetch('/api/content/pricing')
      .then((r) => r.json())
      .then((data) => setPricing(data))
      .catch((error) => console.error('Error fetching pricing:', error))
      .finally(() => setIsLoading(false))
  }, [])

  const tiers: MembershipTier[] = [
    {
      id: 'membership-basic',
      name: 'Basic Access',
      tier: 'BASIC_ACCESS',
      price: pricing?.items?.['membership-basic']?.displayFormat || '$299',
      credits: pricing?.items?.['membership-basic']?.metadata?.credits || 750,
      duration: '1 year',
      icon: Star,
      description: 'Perfect for small projects and individual developers',
      features: [
        '750 credits included',
        '1 year validity',
        'Access to digital products',
        'Basic support',
        'Priority updates',
        'Community access',
      ],
    },
    {
      id: 'membership-pro',
      name: 'Pro',
      tier: 'PRO',
      price: pricing?.items?.['membership-pro']?.displayFormat || '$1,499',
      credits: pricing?.items?.['membership-pro']?.metadata?.credits || 1500,
      duration: '2 years',
      icon: Zap,
      popular: true,
      description: 'Best value for growing teams and serious projects',
      features: [
        '1,500 credits included',
        '2 year validity',
        'All digital products',
        'Priority support',
        'Early access to new products',
        'Quarterly strategy sessions',
        '20% rollover credits',
      ],
    },
    {
      id: 'membership-managed',
      name: 'Managed',
      tier: 'MANAGED',
      price: pricing?.items?.['membership-managed']?.displayFormat || '$499',
      credits: pricing?.items?.['membership-managed']?.metadata?.credits || 500,
      duration: 'per month',
      icon: Crown,
      description: 'Ongoing partnership with monthly credits and dedicated support',
      features: [
        '500 credits monthly',
        'Month-to-month flexibility',
        'All products included',
        'Dedicated support',
        'Monthly consulting call',
        'Custom development hours',
        'Cancel anytime',
      ],
    },
  ]

  const handlePurchase = async (tierId: string, tier: 'BASIC_ACCESS' | 'PRO' | 'MANAGED') => {
    if (!session) {
      showToast('Please login to purchase a membership', 'error')
      router.push('/login?callbackUrl=/memberships')
      return
    }

    try {
      setPurchasing(tierId)
      const response = await fetch('/api/memberships/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate purchase')
      }

      showToast('Redirecting to checkout...', 'success')
      router.push(`/checkout?type=membership&tier=${tier}`)
    } catch (error: any) {
      showToast(error.message || 'Failed to initiate purchase', 'error')
    } finally {
      setPurchasing(null)
    }
  }

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
          <h1 className="text-5xl font-bold text-foreground mb-6">Memberships</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Get access to premium digital products, priority support, and credits for custom work. Choose the plan that fits your needs.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {tiers.map((tier) => {
            const Icon = tier.icon
            const isPurchasing = purchasing === tier.id

            return (
              <div
                key={tier.id}
                className={`relative bg-card rounded-2xl border-2 p-8 flex flex-col ${
                  tier.popular
                    ? 'border-primary shadow-lg shadow-primary/20 scale-105'
                    : 'border-border hover:border-primary/50'
                } transition-all`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}

                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-foreground mb-2">{tier.name}</h3>
                <p className="text-sm text-muted-foreground mb-6">{tier.description}</p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-foreground">{tier.price}</span>
                    {tier.duration && (
                      <span className="text-muted-foreground">/{tier.duration}</span>
                    )}
                  </div>
                  <p className="text-sm text-primary font-medium mt-2">
                    {tier.credits.toLocaleString()} credits included
                  </p>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePurchase(tier.id, tier.tier)}
                  disabled={isPurchasing}
                  className={`w-full py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
                    tier.popular
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-card border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isPurchasing ? (
                    <>
                      <Spinner size="sm" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Get Started
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            )
          })}
        </div>

        {/* Credits Explanation */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
            <h2 className="text-2xl font-bold text-foreground mb-4">How Credits Work</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground">
              <div>
                <p className="mb-3">
                  <strong className="text-foreground">Credits are your currency</strong> for custom work, services, and premium products. Each membership tier comes with a credit balance you can use throughout your term.
                </p>
                <p>
                  For example, a typical web page design costs 50-100 credits, while a full landing page might cost 200-300 credits.
                </p>
              </div>
              <div>
                <p className="mb-3">
                  <strong className="text-foreground">Credits never expire</strong> during your membership period. Pro members get 20% rollover if you renew before expiration.
                </p>
                <p>
                  Managed members receive a fresh 500 credits each month, perfect for ongoing projects and continuous development needs.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-2">
                Can I upgrade or downgrade my membership?
              </h3>
              <p className="text-sm text-muted-foreground">
                Yes! You can upgrade anytime and we'll prorate your current membership. Downgrades take effect at the end of your current billing period.
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-2">
                What happens to unused credits?
              </h3>
              <p className="text-sm text-muted-foreground">
                Basic and Pro credits remain valid for your membership duration. Pro members get 20% rollover on renewal. Managed subscription credits refresh monthly.
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-sm text-muted-foreground">
                We offer a 14-day money-back guarantee for first-time members. If you've used credits, we'll refund the unused portion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
