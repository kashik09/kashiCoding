#!/usr/bin/env tsx
/**
 * One-time migration script: Move JSON content to Postgres
 *
 * This script migrates:
 * - public/content/services.json → PageContent (slug: 'services')
 * - public/content/request-form.json → PageContent (slug: 'request-form')
 * - Legal content → ContentPage (terms, privacy-policy)
 *
 * Usage:
 *   npx tsx scripts/ts/migrate-content-to-db.ts
 *   npx tsx scripts/ts/migrate-content-to-db.ts --dry-run
 */

import fs from 'fs/promises'
import path from 'path'
import { prisma } from '../../lib/prisma'

interface MigrationResult {
  success: boolean
  item: string
  action: 'created' | 'updated' | 'skipped'
  error?: string
}

async function migratePageContent(slug: string, filePath: string, dryRun: boolean): Promise<MigrationResult> {
  try {
    const fullPath = path.join(process.cwd(), filePath)
    const fileContent = await fs.readFile(fullPath, 'utf-8')
    const data = JSON.parse(fileContent)

    if (dryRun) {
      const existing = await prisma.pageContent.findUnique({ where: { slug } })
      return {
        success: true,
        item: slug,
        action: existing ? 'updated' : 'created'
      }
    }

    const result = await prisma.pageContent.upsert({
      where: { slug },
      create: {
        slug,
        data,
        version: data.metadata?.version || '1.0'
      },
      update: {
        data,
        version: data.metadata?.version || '1.0'
      }
    })

    return {
      success: true,
      item: slug,
      action: 'created'
    }
  } catch (error) {
    return {
      success: false,
      item: slug,
      action: 'skipped',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

async function migrateLegalPage(
  slug: string,
  title: string,
  type: 'TERMS' | 'PRIVACY_POLICY',
  contentHtml: string,
  dryRun: boolean
): Promise<MigrationResult> {
  try {
    if (dryRun) {
      const existing = await prisma.contentPage.findUnique({ where: { slug } })
      return {
        success: true,
        item: slug,
        action: existing ? 'updated' : 'created'
      }
    }

    const result = await prisma.contentPage.upsert({
      where: { slug },
      create: {
        slug,
        title,
        type,
        content: contentHtml,
        published: true
      },
      update: {
        title,
        content: contentHtml
      }
    })

    return {
      success: true,
      item: slug,
      action: 'created'
    }
  } catch (error) {
    return {
      success: false,
      item: slug,
      action: 'skipped',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Default legal content (extracted from current TSX files)
const TERMS_CONTENT = `
<h1>Terms of Service</h1>
<p class="text-muted-foreground">Last updated: December 16, 2025</p>

<section>
  <h2>1. Agreement to Terms</h2>
  <p>By accessing or using our services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
</section>

<section>
  <h2>2. Services</h2>
  <p>We provide web development, design, and consulting services. The specific scope of work, deliverables, timelines, and pricing will be outlined in individual project agreements or proposals.</p>
</section>

<section>
  <h2>3. User Accounts</h2>
  <p>When you create an account with us, you must provide accurate, complete, and up-to-date information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.</p>
</section>

<section>
  <h2>4. Intellectual Property</h2>
  <p>The Service and its original content, features, and functionality are and will remain the exclusive property of the service provider. Our Services are protected by copyright, trademark, and other laws.</p>
</section>

<section>
  <h2>5. Payment Terms</h2>
  <p>Payment terms are typically 50% upfront and 50% upon project completion unless otherwise agreed in writing. Late payments may incur additional fees and may result in suspension of services.</p>
</section>

<section>
  <h2>6. Limitation of Liability</h2>
  <p>In no event shall we be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.</p>
</section>

<section>
  <h2>7. Termination</h2>
  <p>We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever.</p>
</section>

<section>
  <h2>8. Changes to Terms</h2>
  <p>We reserve the right to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page.</p>
</section>

<section>
  <h2>9. Contact Information</h2>
  <p>If you have any questions about these Terms, please contact us.</p>
</section>
`.trim()

const PRIVACY_CONTENT = `
<h1>Privacy Policy</h1>
<p class="text-muted-foreground">Last updated: December 16, 2025</p>

<section>
  <h2>1. Introduction</h2>
  <p>This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. By using our services, you consent to the data practices described in this policy.</p>
</section>

<section>
  <h2>2. Information We Collect</h2>
  <h3>2.1 Personal Information</h3>
  <p>We may collect personally identifiable information such as your name, email address, phone number, and payment information when you voluntarily provide it to us.</p>

  <h3>2.2 Usage Data</h3>
  <p>We automatically collect certain information when you visit our website, including your IP address, browser type, operating system, referring URLs, and page interactions.</p>

  <h3>2.3 Cookies and Tracking Technologies</h3>
  <p>We use cookies and similar tracking technologies to track activity on our Service and hold certain information to improve and analyze our Service.</p>
</section>

<section>
  <h2>3. How We Use Your Information</h2>
  <p>We use the information we collect to:</p>
  <ul>
    <li>Provide, operate, and maintain our services</li>
    <li>Process your transactions and send related information</li>
    <li>Send you technical notices, updates, and support messages</li>
    <li>Respond to your comments and questions</li>
    <li>Monitor and analyze usage and trends to improve our services</li>
    <li>Detect, prevent, and address technical issues</li>
  </ul>
</section>

<section>
  <h2>4. Information Sharing and Disclosure</h2>
  <p>We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:</p>
  <ul>
    <li>With service providers who assist us in operating our business</li>
    <li>To comply with legal obligations</li>
    <li>To protect and defend our rights or property</li>
    <li>With your consent</li>
  </ul>
</section>

<section>
  <h2>5. Data Security</h2>
  <p>We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>
</section>

<section>
  <h2>6. Your Rights</h2>
  <p>You have the right to:</p>
  <ul>
    <li>Access the personal information we hold about you</li>
    <li>Request correction of inaccurate data</li>
    <li>Request deletion of your personal information</li>
    <li>Object to processing of your personal information</li>
    <li>Request transfer of your personal information</li>
  </ul>
</section>

<section>
  <h2>7. Children's Privacy</h2>
  <p>Our Service is not intended for users under the age of 13. We do not knowingly collect personal information from children under 13.</p>
</section>

<section>
  <h2>8. Changes to This Privacy Policy</h2>
  <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
</section>

<section>
  <h2>9. Contact Us</h2>
  <p>If you have any questions about this Privacy Policy, please contact us.</p>
</section>
`.trim()

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run') || args.includes('-d')

  console.log(`\n🚀 Starting content migration to database...`)
  console.log(`${dryRun ? '🔍 DRY RUN MODE - No changes will be saved' : '✏️  LIVE MODE - Changes will be written to database'}\n`)

  const results: MigrationResult[] = []

  // Migrate services.json
  console.log('📄 Migrating services.json...')
  const servicesResult = await migratePageContent('services', 'public/content/services.json', dryRun)
  results.push(servicesResult)
  console.log(`   ${servicesResult.success ? '✓' : '✗'} ${servicesResult.action} - ${servicesResult.error || ''}`)

  // Migrate request-form.json
  console.log('📄 Migrating request-form.json...')
  const requestFormResult = await migratePageContent('request-form', 'public/content/request-form.json', dryRun)
  results.push(requestFormResult)
  console.log(`   ${requestFormResult.success ? '✓' : '✗'} ${requestFormResult.action} - ${requestFormResult.error || ''}`)

  // Migrate terms of service
  console.log('📄 Migrating Terms of Service...')
  const termsResult = await migrateLegalPage('terms', 'Terms of Service', 'TERMS', TERMS_CONTENT, dryRun)
  results.push(termsResult)
  console.log(`   ${termsResult.success ? '✓' : '✗'} ${termsResult.action} - ${termsResult.error || ''}`)

  // Migrate privacy policy
  console.log('📄 Migrating Privacy Policy...')
  const privacyResult = await migrateLegalPage('privacy-policy', 'Privacy Policy', 'PRIVACY_POLICY', PRIVACY_CONTENT, dryRun)
  results.push(privacyResult)
  console.log(`   ${privacyResult.success ? '✓' : '✗'} ${privacyResult.action} - ${privacyResult.error || ''}`)

  // Summary
  console.log('\n' + '━'.repeat(50))
  console.log('\n📊 Migration Summary:')
  console.log(`   Total items: ${results.length}`)
  console.log(`   Successful: ${results.filter(r => r.success).length}`)
  console.log(`   Failed: ${results.filter(r => !r.success).length}`)

  if (results.some(r => !r.success)) {
    console.log('\n❌ Errors:')
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.item}: ${r.error}`)
    })
  }

  if (dryRun) {
    console.log('\n⚠️  DRY RUN - No changes were saved to the database')
    console.log('   Run without --dry-run to apply changes\n')
  } else {
    console.log('\n✨ Migration completed successfully!')
    console.log('\n📝 Next steps:')
    console.log('   1. Verify data in database')
    console.log('   2. Update API routes to read from DB')
    console.log('   3. Test pages render correctly')
    console.log('   4. Keep JSON files as fallback (optional)\n')
  }

  await prisma.$disconnect()
}

main().catch((error) => {
  console.error('\n❌ Migration failed:', error)
  process.exit(1)
})
