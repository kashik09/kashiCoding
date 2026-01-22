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
            By accessing or using our products or the site, you agree to these Terms and all applicable laws. If you do not agree, do not use the site or purchase anything.
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
            <li>Custom terms by written agreement</li>
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
          <h2 className="text-2xl font-bold text-foreground mb-4">5. Payments and No Refunds</h2>
          <p className="text-foreground leading-relaxed mb-4">
            All sales are final for digital products, except where required by law.
          </p>
          <p className="text-foreground leading-relaxed mb-4">
            Chargebacks or payment reversals can result in immediate suspension while we investigate.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">6. Accounts, Suspension, and Termination</h2>
          <p className="text-foreground leading-relaxed mb-4">
            You are responsible for your account activity. We may suspend or terminate accounts or licenses for abuse, payment failure, chargebacks, or policy violations.
          </p>
          <p className="text-foreground leading-relaxed mb-4">
            Student/youth verification may be required for certain purchases or age-restricted use. Guardian consent is required for users ages 13-17.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">7. Intellectual Property</h2>
          <p className="text-foreground leading-relaxed mb-4">
            Unless stated in a signed agreement, you own project deliverables after full payment. We retain rights to pre-existing IP and may show completed work in our portfolio.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">8. Disclaimer and Limitation of Liability</h2>
          <p className="text-foreground leading-relaxed mb-4">
            Products are provided "as is" without warranty. To the maximum extent permitted by law, we are not liable for indirect, incidental, or consequential damages.
          </p>
          <p className="text-foreground leading-relaxed mb-4">
            Additionally:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li>Total liability is limited to the amount paid for the specific product</li>
            <li>We are not responsible for third-party services or platforms you integrate</li>
            <li>Clients are responsible for maintaining backups of their data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">9. Changes to Terms</h2>
          <p className="text-foreground leading-relaxed mb-4">
            We may update these Terms from time to time. Changes are effective when posted.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">10. Contact</h2>
          <p className="text-foreground leading-relaxed mb-4">
            If you have any questions about these Terms of Service, submit a complaint through the site.
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
            By using our products, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
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
