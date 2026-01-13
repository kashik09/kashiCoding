import Link from 'next/link'

export default function AcceptableUsePage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Acceptable Use Policy</h1>
        <p className="text-muted-foreground">Last updated: January 12, 2026</p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">1. Purpose</h2>
          <p className="text-foreground leading-relaxed mb-4">
            This policy protects customers and keeps the platform reliable. It applies to the site, digital products, and services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">2. Allowed Use</h2>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li>Use products and services for lawful, internal purposes.</li>
            <li>Share access only within your licensed team limit.</li>
            <li>Use credits only for scoped work we both approve.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">3. Prohibited Use</h2>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li>Sharing, reselling, sublicensing, or redistributing any digital product.</li>
            <li>Bypassing license checks, download limits, or security controls.</li>
            <li>Account sharing, scraping, or automated abuse.</li>
            <li>Uploading malicious files or attempting to exploit vulnerabilities.</li>
            <li>Misrepresenting identity, age, or student eligibility.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">4. Enforcement</h2>
          <p className="text-foreground leading-relaxed mb-4">
            We log downloads, license actions, and abuse signals for security. Violations may lead to license suspension, account freeze, or termination.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">5. Contact</h2>
          <p className="text-foreground leading-relaxed mb-4">
            Report abuse or security issues through the contact form.
          </p>
          <Link href="/contact" className="text-primary hover:underline">
            Contact support
          </Link>
        </section>
      </div>
    </div>
  )
}
