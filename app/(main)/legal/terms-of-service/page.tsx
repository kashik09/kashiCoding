'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Spinner } from '@/components/ui/Spinner'

export default function TermsPage() {
  const [content, setContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/content/terms')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setContent(data.data)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!content) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: January 12, 2026</p>
        </div>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">1. Agreement to Terms</h2>
          <p className="text-foreground leading-relaxed mb-4">
            By accessing or using our products or services, you agree to these Terms and all applicable laws. If you do not agree, do not use the site or purchase anything.
          </p>
          <p className="text-foreground leading-relaxed mb-4">
            These Terms incorporate our Acceptable Use Policy, Refund Policy, and License Terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">2. Digital Products and License Terms</h2>
          <p className="text-foreground leading-relaxed mb-4">
            All digital products (including Portfolio Starter) are one-time purchases delivered as downloads and licensed, not sold. Licenses are non-transferable and for internal use only.
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li>No resale, redistribution, or sublicensing</li>
            <li>One person or one team per license tier</li>
            <li>License sharing outside your team is prohibited</li>
            <li>Use of products for client work is allowed under the correct license</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">3. License Tiers and Seats</h2>
          <p className="text-foreground leading-relaxed mb-4">
            License tiers determine allowed usage and seats.
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li>Personal: 1 user, 1 active device/session</li>
            <li>Commercial: 1 user for business or client work</li>
            <li>Team: 2-5 users, seats must be assigned</li>
            <li>Enterprise: custom terms by written agreement</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">4. Downloads, Abuse Detection, and Anti-Resale</h2>
          <p className="text-foreground leading-relaxed mb-4">
            Download limits and device limits are enforced to prevent abuse. We maintain audit logs of license actions and download activity. Abuse or license sharing may result in automatic suspension or termination.
          </p>

          <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Prohibited Activities</h3>
          <p className="text-foreground leading-relaxed mb-4">
            The following are strictly prohibited and will result in immediate account suspension:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li>Reselling products or licenses to others</li>
            <li>Sharing download links publicly or with unauthorized users</li>
            <li>Posting license keys publicly on forums or social media</li>
            <li>Creating multiple accounts to bypass license restrictions</li>
            <li>Excessive downloads from multiple IPs or devices</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Automated Abuse Detection</h3>
          <p className="text-foreground leading-relaxed mb-4">
            Our systems automatically detect suspicious behavior including:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li>Excessive downloads (more than 10 in 24 hours)</li>
            <li>Downloads from multiple IP addresses (more than 5 in 24 hours)</li>
            <li>Multiple devices for personal licenses (more than 3 devices)</li>
            <li>Download patterns consistent with resale or redistribution</li>
          </ul>
          <p className="text-foreground leading-relaxed mb-4 mt-4">
            High-confidence abuse (suspicion score of 70 or above) triggers automatic account suspension and license revocation. Medium-confidence abuse is flagged for manual admin review.
          </p>

          <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Account Suspension</h3>
          <p className="text-foreground leading-relaxed mb-4">
            Suspended accounts cannot make purchases or download products. All active licenses are revoked upon suspension. You may appeal suspensions by contacting support with evidence. No refunds are provided for violations.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">5. Services, Credits, and Subscriptions</h2>
          <p className="text-foreground leading-relaxed mb-4">
            Services are delivered through scoped work. Credits are prepaid service units, not money, not hours, and not unlimited. We confirm scope and credit usage before work starts.
          </p>
          <p className="text-foreground leading-relaxed mb-4">
            A written scope, statement of work, or explicit approval is required before we begin. Submitting a request does not create a contract.
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li>Small fix: narrow, reversible change (typically 2-4 credits)</li>
            <li>Scoped work: defined deliverable with clear boundaries</li>
            <li>Living systems: auth, dashboards, e-commerce, RBAC, data-heavy apps</li>
            <li>Living systems strongly require subscription/retainer support</li>
            <li>Cash one-off payments may still be available by agreement</li>
            <li>Scope changes cost extra (credits or additional payment)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">6. Credits Expiration and Rollover</h2>
          <p className="text-foreground leading-relaxed mb-4">
            Credits are usable while valid and expire based on the plan terms. Some plans may allow limited rollover, capped at the plan limit. Expired credits are forfeited.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">7. Payments and No Refunds</h2>
          <p className="text-foreground leading-relaxed mb-4">
            All sales are final. Digital products, memberships, subscriptions, and credits are non-refundable after purchase or payment, except where required by law.
          </p>
          <p className="text-foreground leading-relaxed mb-4">
            Chargebacks or payment reversals can result in immediate suspension while we investigate.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">8. Student & Youth Discount Program</h2>

          <h3 className="text-xl font-semibold text-foreground mb-3">Eligibility</h3>
          <p className="text-foreground leading-relaxed mb-4">
            We offer a 50% discount for verified students (ages 18+) and youth (ages 13-18):
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li>Student Discount (18+): Must be enrolled in an accredited educational institution with valid student email or ID</li>
            <li>Youth Discount (13-18): Requires guardian email and explicit guardian consent</li>
            <li>Verification expires after 12 months and can be renewed</li>
            <li>Users under 13 may not use the service</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Verification Process</h3>
          <p className="text-foreground leading-relaxed mb-4">
            All applications are manually reviewed by administrators within 1-2 business days. You must provide:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li>Institution name and country</li>
            <li>School email (.edu or institutional domain) OR student ID upload</li>
            <li>For youth (13-18): Guardian email and consent</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Discount Terms</h3>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li>50% off personal-tier products and services only</li>
            <li>Not valid for team or commercial licenses</li>
            <li>Cannot be combined with other promotions</li>
            <li>Stricter scope boundaries than regular personal tier</li>
            <li>No refunds on discounted purchases</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Fraud Prevention</h3>
          <p className="text-foreground leading-relaxed mb-4">
            Zero-tolerance policy for fraudulent information. Fake IDs, falsified enrollment letters, or misrepresentation of age/guardian consent will result in:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li>Immediate account suspension</li>
            <li>Permanent ban from student program</li>
            <li>Revocation of all licenses</li>
            <li>No refunds issued</li>
          </ul>
          <p className="text-foreground leading-relaxed mb-4 mt-4">
            We reserve the right to request additional verification at any time and report fraudulent activities to authorities.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">9. Accounts, Suspension, and Termination</h2>
          <p className="text-foreground leading-relaxed mb-4">
            You are responsible for your account activity. We may suspend or terminate accounts or licenses for abuse, payment failure, chargebacks, or policy violations.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">10. Intellectual Property</h2>
          <p className="text-foreground leading-relaxed mb-4">
            Unless stated in a signed agreement, you own project deliverables after full payment. We retain rights to pre-existing IP and may show completed work in our portfolio.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">11. Disclaimer and Limitation of Liability</h2>
          <p className="text-foreground leading-relaxed mb-4">
            Services and products are provided "as is" without warranty. To the maximum extent permitted by law, we are not liable for indirect, incidental, or consequential damages.
          </p>
          <p className="text-foreground leading-relaxed mb-4">
            Additionally:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li>Total liability is limited to the amount paid for the specific product or service</li>
            <li>We are not responsible for third-party services or platforms used in projects</li>
            <li>Clients are responsible for maintaining backups of their data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">12. Changes to Terms</h2>
          <p className="text-foreground leading-relaxed mb-4">
            We may update these Terms from time to time. Changes are effective when posted.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">13. Contact</h2>
          <p className="text-foreground leading-relaxed mb-4">
            If you have any questions about these Terms of Service, please contact us through the contact form on our website or via the contact information provided on our site.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Related Policies</h2>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li>
              <Link href="/legal/acceptable-use" className="text-primary hover:underline">
                Acceptable Use Policy
              </Link>
            </li>
            <li>
              <Link href="/legal/refund-policy" className="text-primary hover:underline">
                Refund Policy
              </Link>
            </li>
            <li>
              <Link href="/legal/license-terms" className="text-primary hover:underline">
                License Terms
              </Link>
            </li>
          </ul>
        </section>

        <div className="mt-12 p-6 bg-muted rounded-lg border border-border">
          <p className="text-sm text-muted-foreground">
            By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </p>
        </div>
      </div>
    </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">{content.title}</h1>
        <p className="text-muted-foreground">
          Last updated: {new Date(content.updatedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
        <div dangerouslySetInnerHTML={{ __html: content.content }} />
      </div>
    </div>
  )
}
