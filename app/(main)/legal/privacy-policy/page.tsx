'use client'

import { useState, useEffect } from 'react'
import { Spinner } from '@/components/ui/Spinner'

export default function PrivacyPage() {
  const [content, setContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/content/privacy-policy')
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
          <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: January 12, 2026</p>
        </div>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">1. Introduction</h2>
          <p className="text-foreground leading-relaxed mb-4">
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. By using our services, you consent to the data practices described in this policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">2. Information We Collect</h2>

          <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">2.1 Information You Provide</h3>
          <p className="text-foreground leading-relaxed mb-4">
            We collect information you provide directly, such as:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li>Name, email, and contact details</li>
            <li>Account credentials</li>
            <li>Orders, licenses, and download history</li>
            <li>Service requests and project details</li>
            <li>Student verification submissions (age, school email, optional ID)</li>
            <li>Payment details handled by payment providers</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">2.2 Automatically Collected Information</h3>
          <p className="text-foreground leading-relaxed mb-4">
            When you use the site, we may collect:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li>IP address (hashed when stored for audit logs)</li>
            <li>Browser and device details</li>
            <li>Pages visited and interactions</li>
            <li>Approximate location data</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">2.3 Cookies and Tracking</h3>
          <p className="text-foreground leading-relaxed mb-4">
            We use cookies for essential functionality, preferences, and optional analytics. We do not use ad tracking cookies.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">3. How We Use Your Information</h2>
          <p className="text-foreground leading-relaxed mb-4">
            We use information to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li>Deliver products, licenses, and downloads</li>
            <li>Provide and scope services and credits</li>
            <li>Verify student eligibility and consent</li>
            <li>Prevent abuse, fraud, and chargebacks</li>
            <li>Communicate updates and respond to support</li>
            <li>Improve the site and internal operations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">4. Information Sharing</h2>
          <p className="text-foreground leading-relaxed mb-4">
            We do not sell your data. We may share information with:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li>Payment processors and billing providers</li>
            <li>Hosting, analytics, and email vendors</li>
            <li>Legal authorities when required by law</li>
            <li>Professional advisors for compliance or disputes</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">5. Security and Audit Logs</h2>
          <p className="text-foreground leading-relaxed mb-4">
            We use security controls, access limitations, and audit logging to protect accounts, licenses, and downloads. IP addresses are hashed when stored for audit logs where possible.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">6. Data Retention</h2>
          <p className="text-foreground leading-relaxed mb-4">
            We retain account, order, license, and audit records as long as needed for operational, legal, or security purposes. Student verification data is retained only as long as necessary for verification and compliance, then removed or anonymized.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">7. Your Rights</h2>
          <p className="text-foreground leading-relaxed mb-4">
            Depending on your location, you may request access, correction, or deletion of personal data. Contact us to make a request.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">8. Age Requirements</h2>
          <p className="text-foreground leading-relaxed mb-4">
            The service is not intended for children under 13. Users ages 13-17 may use limited features with verification and guardian consent where required by law.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">9. International Transfers</h2>
          <p className="text-foreground leading-relaxed mb-4">
            Your information may be processed in countries outside your location. By using the service, you consent to these transfers where permitted by law.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">10. Changes to This Policy</h2>
          <p className="text-foreground leading-relaxed mb-4">
            We may update this Privacy Policy from time to time. Changes are effective when posted.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">11. Contact</h2>
          <p className="text-foreground leading-relaxed mb-4">
            If you have questions or requests regarding this Privacy Policy, contact us through the site contact form.
          </p>
        </section>

        <div className="mt-12 p-6 bg-muted rounded-lg border border-border">
          <p className="text-sm text-muted-foreground">
            By using our website and services, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.
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
