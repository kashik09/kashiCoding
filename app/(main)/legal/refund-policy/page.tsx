import Link from 'next/link'

export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Refund Policy</h1>
        <p className="text-muted-foreground">Last updated: January 12, 2026</p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">1. No Refunds</h2>
          <p className="text-foreground leading-relaxed mb-4">
            All sales are final. Digital products, memberships, subscriptions, and credits are non-refundable after purchase or payment, except where required by law.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">2. Digital Products</h2>
          <p className="text-foreground leading-relaxed mb-4">
            Digital products are licensed and delivered as downloads. No refunds after purchase, delivery, or license issuance.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">3. Services and Credits</h2>
          <p className="text-foreground leading-relaxed mb-4">
            Credits are prepaid service units, not currency, not hours, and have no cash value. Credits are usable while valid and expire based on plan terms. Unused credits are forfeited at expiration.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">4. Chargebacks</h2>
          <p className="text-foreground leading-relaxed mb-4">
            Chargebacks or payment reversals may result in immediate suspension while the dispute is investigated.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">5. Contact</h2>
          <p className="text-foreground leading-relaxed mb-4">
            If you believe a legal exception applies, contact support.
          </p>
          <Link href="/contact" className="text-primary hover:underline">
            Contact support
          </Link>
        </section>
      </div>
    </div>
  )
}
