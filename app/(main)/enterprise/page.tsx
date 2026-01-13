import Link from 'next/link'

export default function EnterprisePage() {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl space-y-10">
        <section className="space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Enterprise</p>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Custom scope, custom quote
          </h1>
          <p className="text-lg text-muted-foreground">
            Enterprise work is handled by conversation, not a public price list. We quote after reviewing scope, risk, and support needs.
          </p>
        </section>

        <section className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Enterprise triggers</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>6+ users or multiple teams</li>
            <li>Redistribution, white-label, or client-facing tooling</li>
            <li>Auth, dashboards, e-commerce, RBAC, or data-heavy apps</li>
            <li>Security, compliance, or SLA requirements</li>
          </ul>
        </section>

        <section className="bg-muted/40 border border-border rounded-2xl p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Next steps</h2>
          <p className="text-sm text-muted-foreground">
            Share your requirements and timelines. We will respond with a scoped plan and quote.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition"
          >
            Contact for a quote
          </Link>
        </section>
      </div>
    </div>
  )
}
