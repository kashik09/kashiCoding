import { MembershipTier } from '@prisma/client'

export interface MembershipPlan {
  tier: MembershipTier
  name: string
  description: string
  price: number
  credits: number
  rolloverCap: number
  features: string[]
  popular?: boolean
  durationDays: number
}

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    tier: 'BASIC_ACCESS',
    name: 'Basic Access',
    description: 'Essential access for single projects',
    price: 299,
    credits: 750,
    rolloverCap: 0,
    durationDays: 365, // 12 months
    features: [
      '750 credits total (12-month term)',
      'Credits expire after 12 months',
      'No rollover credits',
      'Standard response time',
      'Access to essential services',
    ],
  },
  {
    tier: 'PRO',
    name: 'Pro',
    description: 'Best for professionals and growing businesses',
    price: 1499,
    credits: 1500,
    rolloverCap: 250,
    durationDays: 365, // 12 months
    features: [
      '1500 credits per year (12-month term)',
      'Credits expire after 12 months',
      'Up to 250 credits rollover',
      'Priority service queue',
      'Faster response time',
      'Expanded service access',
    ],
  },
  {
    tier: 'MANAGED',
    name: 'Managed',
    description: 'Full-service solution with monthly renewal',
    price: 499,
    credits: 500,
    rolloverCap: 0,
    durationDays: 30, // Monthly
    features: [
      '500 credits per month',
      'Credits expire monthly (no rollover)',
      'Hosting management included',
      'Dedicated project manager',
      '24/7 priority support',
      'Fastest response time',
      'Downgrade/pause allowed',
      'Custom service requests',
    ],
  },
]

export function getMembershipPlan(tier: MembershipTier): MembershipPlan | undefined {
  return MEMBERSHIP_PLANS.find(plan => plan.tier === tier)
}

export function getMembershipPlanByName(name: string): MembershipPlan | undefined {
  return MEMBERSHIP_PLANS.find(plan => plan.name.toLowerCase() === name.toLowerCase())
}
