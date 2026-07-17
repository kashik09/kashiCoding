import { prisma } from '../../lib/prisma'

const termsContent = `<section>
<h2>1. Agreement to Terms</h2>
<p>By accessing or using our products or services, you agree to these Terms and all applicable laws. If you do not agree, do not use the site or purchase anything.</p>
<p>These Terms incorporate our Acceptable Use Policy, Refund Policy, and License Terms.</p>
</section>

<section>
<h2>2. Digital Products and License Terms</h2>
<p>All digital products (including Portfolio Starter) are one-time purchases delivered as downloads and licensed, not sold. Licenses are non-transferable and for internal use only.</p>
<ul>
<li>No resale, redistribution, or sublicensing</li>
<li>One person or one team per license tier</li>
<li>License sharing outside your team is prohibited</li>
<li>Use of products for client work is allowed under the correct license</li>
</ul>
</section>

<section>
<h2>3. License Tiers and Seats</h2>
<p>License tiers determine allowed usage and seats.</p>
<ul>
<li>Personal: 1 user, 1 active device/session</li>
<li>Commercial: 1 user for business or client work</li>
<li>Team: 2-5 users, seats must be assigned</li>
<li>Enterprise: custom terms by written agreement</li>
</ul>
</section>

<section>
<h2>4. Downloads, Abuse, and Audit Logs</h2>
<p>Download limits and device limits are enforced to prevent abuse. We maintain audit logs of license actions and download activity. Abuse or license sharing may result in suspension or termination.</p>
</section>

<section>
<h2>5. Services, Credits, and Subscriptions</h2>
<p>Services are delivered through scoped work. Credits are prepaid service units, not money, not hours, and not unlimited. We confirm scope and credit usage before work starts.</p>
<p>A written scope, statement of work, or explicit approval is required before we begin. Submitting a request does not create a contract.</p>
<ul>
<li>Small fix: narrow, reversible change (typically 2-4 credits)</li>
<li>Scoped work: defined deliverable with clear boundaries</li>
<li>Living systems: auth, dashboards, e-commerce, RBAC, data-heavy apps</li>
<li>Living systems strongly require subscription/retainer support</li>
<li>Cash one-off payments may still be available by agreement</li>
<li>Scope changes cost extra (credits or additional payment)</li>
</ul>
</section>

<section>
<h2>6. Credits Expiration and Rollover</h2>
<p>Credits are usable while valid and expire based on the plan terms. Some plans may allow limited rollover, capped at the plan limit. Expired credits are forfeited.</p>
</section>

<section>
<h2>7. Payments and No Refunds</h2>
<p>All sales are final. Digital products, memberships, subscriptions, and credits are non-refundable after purchase or payment, except where required by law.</p>
<p>Chargebacks or payment reversals can result in immediate suspension while we investigate.</p>
</section>

<section>
<h2>8. Minors and Student Discounts (Ages 13-17)</h2>
<p>Users under 13 may not use the service. Users ages 13-17 may access limited features with verification and guardian consent where required by law. Student discounts for ages 13-18 require manual verification and stricter scope limits.</p>
</section>

<section>
<h2>9. Accounts, Suspension, and Termination</h2>
<p>You are responsible for your account activity. We may suspend or terminate accounts or licenses for abuse, payment failure, chargebacks, or policy violations.</p>
</section>

<section>
<h2>10. Intellectual Property</h2>
<p>Unless stated in a signed agreement, you own project deliverables after full payment. We retain rights to pre-existing IP and may show completed work in our portfolio.</p>
</section>

<section>
<h2>11. Disclaimer and Limitation of Liability</h2>
<p>Services and products are provided &quot;as is&quot; without warranty. To the maximum extent permitted by law, we are not liable for indirect, incidental, or consequential damages.</p>
<ul>
<li>Total liability is limited to the amount paid for the specific product or service</li>
<li>We are not responsible for third-party services or platforms used in projects</li>
<li>Clients are responsible for maintaining backups of their data</li>
</ul>
</section>

<section>
<h2>12. Changes to Terms</h2>
<p>We may update these Terms from time to time. Changes are effective when posted.</p>
</section>

<section>
<h2>13. Contact</h2>
<p>If you have any questions about these Terms of Service, please contact us through the contact form on our website.</p>
</section>`

const privacyContent = `<section>
<h2>1. Introduction</h2>
<p>This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. By using our services, you consent to the data practices described in this policy.</p>
</section>

<section>
<h2>2. Information We Collect</h2>
<h3>2.1 Information You Provide</h3>
<p>We collect information you provide directly, such as:</p>
<ul>
<li>Name, email, and contact details</li>
<li>Account credentials</li>
<li>Orders, licenses, and download history</li>
<li>Service requests and project details</li>
<li>Student verification submissions (age, school email, optional ID)</li>
<li>Payment details handled by payment providers</li>
</ul>

<h3>2.2 Automatically Collected Information</h3>
<p>When you use the site, we may collect:</p>
<ul>
<li>IP address (hashed when stored for audit logs)</li>
<li>Browser and device details</li>
<li>Pages visited and interactions</li>
<li>Approximate location data</li>
</ul>

<h3>2.3 Cookies and Tracking</h3>
<p>We use cookies for essential functionality, preferences, and optional analytics. We do not use ad tracking cookies.</p>
</section>

<section>
<h2>3. How We Use Your Information</h2>
<p>We use information to:</p>
<ul>
<li>Deliver products, licenses, and downloads</li>
<li>Provide and scope services and credits</li>
<li>Verify student eligibility and consent</li>
<li>Prevent abuse, fraud, and chargebacks</li>
<li>Communicate updates and respond to support</li>
<li>Improve the site and internal operations</li>
</ul>
</section>

<section>
<h2>4. Information Sharing</h2>
<p>We do not sell your data. We may share information with:</p>
<ul>
<li>Payment processors and billing providers</li>
<li>Hosting, analytics, and email vendors</li>
<li>Legal authorities when required by law</li>
<li>Professional advisors for compliance or disputes</li>
</ul>
</section>

<section>
<h2>5. Security and Audit Logs</h2>
<p>We use security controls, access limitations, and audit logging to protect accounts, licenses, and downloads. IP addresses are hashed when stored for audit logs where possible.</p>
</section>

<section>
<h2>6. Data Retention</h2>
<p>We retain account, order, license, and audit records as long as needed for operational, legal, or security purposes. Student verification data is retained only as long as necessary for verification and compliance, then removed or anonymized.</p>
</section>

<section>
<h2>7. Your Rights</h2>
<p>Depending on your location, you may request access, correction, or deletion of personal data. Contact us to make a request.</p>
</section>

<section>
<h2>8. Age Requirements</h2>
<p>The service is not intended for children under 13. Users ages 13-17 may use limited features with verification and guardian consent where required by law.</p>
</section>

<section>
<h2>9. International Transfers</h2>
<p>Your information may be processed in countries outside your location. By using the service, you consent to these transfers where permitted by law.</p>
</section>

<section>
<h2>10. Changes to This Policy</h2>
<p>We may update this Privacy Policy from time to time. Changes are effective when posted.</p>
</section>

<section>
<h2>11. Contact</h2>
<p>If you have questions or requests regarding this Privacy Policy, contact us through the site contact form.</p>
</section>`

async function main() {
  console.log('Seeding legal content...')

  // Upsert Terms of Service
  await prisma.contentPage.upsert({
    where: { slug: 'terms' },
    update: {
      title: 'Terms of Service',
      content: termsContent,
      published: true,
    },
    create: {
      slug: 'terms',
      title: 'Terms of Service',
      type: 'TERMS',
      content: termsContent,
      published: true
    }
  })
  console.log('✓ Terms of Service created')

  // Upsert Privacy Policy
  await prisma.contentPage.upsert({
    where: { slug: 'privacy-policy' },
    update: {
      title: 'Privacy Policy',
      content: privacyContent,
      published: true,
    },
    create: {
      slug: 'privacy-policy',
      title: 'Privacy Policy',
      type: 'PRIVACY_POLICY',
      content: privacyContent,
      published: true
    }
  })
  console.log('✓ Privacy Policy created')

  console.log('Done!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
