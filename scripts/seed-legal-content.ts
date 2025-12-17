import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const termsContent = `<section>
<h2>1. Agreement to Terms</h2>
<p>By accessing or using our services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
</section>

<section>
<h2>2. Services</h2>
<p>We provide web development, design, and consulting services. The specific scope of work, deliverables, timelines, and pricing will be outlined in individual project agreements or proposals.</p>
<ul>
<li>Web Development (Frontend & Backend)</li>
<li>Mobile Development</li>
<li>UI/UX Design</li>
<li>Technical Consulting</li>
<li>Custom Software Solutions</li>
</ul>
</section>

<section>
<h2>3. Project Requests</h2>
<p>When you submit a project request through our platform:</p>
<ul>
<li>You authorize us to contact you via email, phone, or other provided contact methods</li>
<li>Project requests do not constitute a binding agreement until both parties sign a formal contract</li>
<li>We reserve the right to decline any project request for any reason</li>
<li>Response time is typically within 24-48 business hours</li>
</ul>
</section>

<section>
<h2>4. User Accounts</h2>
<p>If you create an account on our platform:</p>
<ul>
<li>You are responsible for maintaining the confidentiality of your account credentials</li>
<li>You are responsible for all activities that occur under your account</li>
<li>You must notify us immediately of any unauthorized access to your account</li>
<li>We reserve the right to suspend or terminate accounts that violate these terms</li>
</ul>
</section>

<section>
<h2>5. Contact Information</h2>
<p>If you have any questions about these Terms of Service, please contact us through the contact form on our website or via the contact information provided on our site.</p>
</section>`

const privacyContent = `<section>
<h2>1. Introduction</h2>
<p>This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. By using our services, you consent to the data practices described in this policy.</p>
</section>

<section>
<h2>2. Information We Collect</h2>
<h3>2.1 Personal Information</h3>
<p>We may collect personal information that you voluntarily provide to us, including:</p>
<ul>
<li>Name and contact information (email, phone number)</li>
<li>Company name and business information</li>
<li>Project details and requirements</li>
<li>Payment and billing information</li>
<li>Account credentials (username, password)</li>
</ul>

<h3>2.2 Automatically Collected Information</h3>
<p>When you visit our website, we may automatically collect:</p>
<ul>
<li>IP address and location data</li>
<li>Browser type and version</li>
<li>Device information</li>
<li>Pages visited and time spent on site</li>
</ul>
</section>

<section>
<h2>3. How We Use Your Information</h2>
<p>We use the collected information for various purposes:</p>
<ul>
<li>To provide, maintain, and improve our services</li>
<li>To process project requests and communicate with you</li>
<li>To send administrative information and updates</li>
<li>To respond to inquiries and provide customer support</li>
<li>To analyze usage patterns and optimize our website</li>
</ul>
</section>

<section>
<h2>4. Data Security</h2>
<p>We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure.</p>
</section>

<section>
<h2>5. Contact Us</h2>
<p>If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us through the contact form on our website.</p>
</section>`

async function main() {
  console.log('Seeding legal content...')

  // Upsert Terms of Service
  await prisma.contentPage.upsert({
    where: { slug: 'terms' },
    update: {},
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
    update: {},
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
