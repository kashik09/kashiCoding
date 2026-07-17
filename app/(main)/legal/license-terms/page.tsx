import Link from 'next/link'

export default function LicenseTermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">License Terms</h1>
        <p className="text-muted-foreground">Last updated: January 12, 2026</p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">1. License Grant</h2>
          <p className="text-foreground leading-relaxed mb-4">
            You receive a non-exclusive, non-transferable license for internal use. You may ship client work built with the product, but you may not resell or redistribute the product itself.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">2. License Types</h2>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li>Personal: 1 user, 1 active device/session.</li>
            <li>Commercial: 1 user for business or client work.</li>
            <li>Team: 2-5 users, seats must be assigned.</li>
            <li>Custom terms by written agreement.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">3. Restrictions</h2>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li>No resale, redistribution, or sublicensing.</li>
            <li>No license sharing outside your team.</li>
            <li>No bypassing access controls, download limits, or security checks.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">4. Enforcement</h2>
          <p className="text-foreground leading-relaxed mb-4">
            We use download limits, device limits, and audit logs to reduce abuse. Violations or chargebacks can lead to suspension or termination.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">5. Contact</h2>
          <p className="text-foreground leading-relaxed mb-4">
            Contact us if you need custom terms.
          </p>
          <Link href="/complaints" className="text-primary hover:underline">
            Submit a complaint
          </Link>
        </section>
      </div>
    </div>
  )
}
