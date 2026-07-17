#!/usr/bin/env tsx
/**
 * Generate PRICES_TO_REVIEW.md from DB content
 *
 * This script extracts pricing information from:
 * - Services page (PageContent: 'services')
 * - Request form page (PageContent: 'request-form')
 *
 * And generates a markdown document for pricing review.
 *
 * Usage:
 *   npx tsx scripts/generate-prices-to-review.ts
 */

import fs from 'fs/promises'
import path from 'path'
import { prisma } from '../../lib/prisma'

interface PricingItem {
  item: string
  currentPrice: string
  location: string
  notes: string
}

function extractPricesFromText(text: string): string[] {
  // Match various price patterns: $500, $1,000, $500-1000, From $500, etc.
  const priceRegex = /(?:from\s+|starting\s+at\s+)?\$[\d,]+(?:\s*-\s*\$?[\d,]+)?(?:\/\w+)?/gi
  return text.match(priceRegex) || []
}

function hasPricingMention(text: string): boolean {
  const pricingKeywords = ['$', 'price', 'cost', 'fee', 'payment', 'budget', 'rate', 'pricing']
  return pricingKeywords.some(keyword => text.toLowerCase().includes(keyword))
}

async function extractServicesPage(): Promise<PricingItem[]> {
  const items: PricingItem[] = []

  try {
    const pageContent = await prisma.pageContent.findUnique({
      where: { slug: 'services' }
    })

    if (!pageContent) {
      console.warn('Services page not found in database')
      return items
    }

    const data = pageContent.data as any

    // Extract from services array
    if (data.services && Array.isArray(data.services)) {
      for (const service of data.services) {
        if (service.pricing) {
          items.push({
            item: service.title || service.id,
            currentPrice: service.pricing,
            location: `services → services[${service.id}].pricing`,
            notes: 'Service pricing displayed on services page'
          })
        }

        // Check description for pricing mentions
        if (service.description && hasPricingMention(service.description)) {
          const prices = extractPricesFromText(service.description)
          if (prices.length > 0) {
            items.push({
              item: `${service.title} (description)`,
              currentPrice: prices.join(', '),
              location: `services → services[${service.id}].description`,
              notes: 'Pricing mention in service description'
            })
          }
        }
      }
    }

    // Check CTA for pricing mentions
    if (data.cta) {
      const ctaText = `${data.cta.heading || ''} ${data.cta.text || ''} ${data.cta.buttonText || ''}`
      if (hasPricingMention(ctaText)) {
        const prices = extractPricesFromText(ctaText)
        if (prices.length > 0) {
          items.push({
            item: 'Services CTA',
            currentPrice: prices.join(', '),
            location: 'services → cta',
            notes: 'Pricing mention in call-to-action'
          })
        }
      }
    }

    // Check FAQ for pricing mentions
    if (data.faq && Array.isArray(data.faq)) {
      for (const faq of data.faq) {
        const faqText = `${faq.question || ''} ${faq.answer || ''}`
        if (hasPricingMention(faqText)) {
          const prices = extractPricesFromText(faqText)
          items.push({
            item: `FAQ: ${faq.question?.substring(0, 50) || faq.id}`,
            currentPrice: prices.length > 0 ? prices.join(', ') : '(mentioned)',
            location: `services → faq[${faq.id}]`,
            notes: 'FAQ contains pricing or payment information'
          })
        }
      }
    }
  } catch (error) {
    console.error('Error extracting services pricing:', error)
  }

  return items
}

async function extractRequestFormPage(): Promise<PricingItem[]> {
  const items: PricingItem[] = []

  try {
    const pageContent = await prisma.pageContent.findUnique({
      where: { slug: 'request-form' }
    })

    if (!pageContent) {
      console.warn('Request form page not found in database')
      return items
    }

    const data = pageContent.data as any

    // Extract budget ranges
    if (data.fields?.budgetRanges && Array.isArray(data.fields.budgetRanges)) {
      for (const range of data.fields.budgetRanges) {
        items.push({
          item: 'Budget Range',
          currentPrice: range.label,
          location: `request-form → fields.budgetRanges[${range.value}]`,
          notes: 'User-selectable budget option in request form'
        })
      }
    }

    // Check for any other pricing mentions in labels or placeholders
    const allText = JSON.stringify(data)
    if (hasPricingMention(allText)) {
      const prices = extractPricesFromText(allText)
      if (prices.length > 0) {
        items.push({
          item: 'Request Form (other)',
          currentPrice: prices.join(', '),
          location: 'request-form → various fields',
          notes: 'Other pricing mentions found in form content'
        })
      }
    }
  } catch (error) {
    console.error('Error extracting request form pricing:', error)
  }

  return items
}

async function generateMarkdown(items: PricingItem[]): Promise<string> {
  const now = new Date().toISOString()

  let md = `# Prices to Review\n\n`
  md += `**Generated:** ${now}\n`
  md += `**Source:** Database (PageContent table)\n\n`
  md += `---\n\n`

  md += `## Overview\n\n`
  md += `This document lists all pricing information extracted from database content.\n`
  md += `Review these prices periodically to ensure accuracy and consistency.\n\n`

  md += `**Total Pricing Items Found:** ${items.length}\n\n`

  // Group by page
  const serviceItems = items.filter(i => i.location.startsWith('services'))
  const requestFormItems = items.filter(i => i.location.startsWith('request-form'))

  md += `- Services Page: ${serviceItems.length} items\n`
  md += `- Request Form: ${requestFormItems.length} items\n\n`

  md += `---\n\n`

  // Services Pricing Table
  md += `## Services Page Pricing\n\n`
  if (serviceItems.length > 0) {
    md += `| Item/Service | Current Price Text | Location | Notes |\n`
    md += `|--------------|-------------------|----------|-------|\n`
    for (const item of serviceItems) {
      md += `| ${item.item} | ${item.currentPrice} | \`${item.location}\` | ${item.notes} |\n`
    }
  } else {
    md += `*No pricing information found on services page.*\n`
  }
  md += `\n`

  // Request Form Pricing Table
  md += `## Request Form Pricing\n\n`
  if (requestFormItems.length > 0) {
    md += `| Item/Service | Current Price Text | Location | Notes |\n`
    md += `|--------------|-------------------|----------|-------|\n`
    for (const item of requestFormItems) {
      md += `| ${item.item} | ${item.currentPrice} | \`${item.location}\` | ${item.notes} |\n`
    }
  } else {
    md += `*No pricing information found in request form.*\n`
  }
  md += `\n`

  md += `---\n\n`

  // Complete Table
  md += `## Complete Pricing Reference\n\n`
  md += `| Item/Service | Current Price Text/Value | Location (Page Slug + Section/Type/Field Path) | Notes |\n`
  md += `|--------------|--------------------------|------------------------------------------------|-------|\n`

  for (const item of items) {
    md += `| ${item.item} | ${item.currentPrice} | \`${item.location}\` | ${item.notes} |\n`
  }

  md += `\n---\n\n`

  // Currency Analysis
  md += `## Currency Analysis\n\n`
  const currencies = new Set<string>()
  const uniquePrices = new Set<string>()

  for (const item of items) {
    if (item.currentPrice.includes('$')) currencies.add('USD ($)')
    if (item.currentPrice.includes('€')) currencies.add('EUR (€)')
    if (item.currentPrice.includes('£')) currencies.add('GBP (£)')

    // Extract numeric values
    const prices = extractPricesFromText(item.currentPrice)
    prices.forEach(p => uniquePrices.add(p))
  }

  md += `**Currencies Detected:**\n`
  if (currencies.size > 0) {
    for (const currency of Array.from(currencies)) {
      md += `- ${currency}\n`
    }
  } else {
    md += `- None detected\n`
  }

  md += `\n**Unique Price Values:**\n`
  if (uniquePrices.size > 0) {
    for (const price of Array.from(uniquePrices).sort()) {
      md += `- ${price}\n`
    }
  } else {
    md += `- None found\n`
  }

  md += `\n---\n\n`

  // Update Instructions
  md += `## How to Update Pricing\n\n`
  md += `### 1. Via Admin Interface\n\n`
  md += `- **Services:** Navigate to \`/admin/content/services\`\n`
  md += `- **Request Form:** Navigate to \`/admin/content/request-form\`\n`
  md += `- Make changes and click "Save Changes"\n`
  md += `- Changes are stored in the database and reflected immediately\n\n`

  md += `### 2. Via Database\n\n`
  md += `Update the \`page_contents\` table directly:\n`
  md += `\`\`\`sql\n`
  md += `-- Example: Update services pricing\n`
  md += `UPDATE page_contents\n`
  md += `SET data = jsonb_set(data, '{services,0,pricing}', '"From $600"')\n`
  md += `WHERE slug = 'services';\n`
  md += `\`\`\`\n\n`

  md += `### 3. Regenerate This Document\n\n`
  md += `After updating prices, regenerate this document:\n`
  md += `\`\`\`bash\n`
  md += `npx tsx scripts/generate-prices-to-review.ts\n`
  md += `\`\`\`\n\n`

  md += `---\n\n`
  md += `*Document generated by \`scripts/generate-prices-to-review.ts\`*\n`

  return md
}

async function main() {
  try {
    console.log('🔍 Extracting pricing information from database...\n')

    console.log('  → Services page...')
    const servicesItems = await extractServicesPage()

    console.log('  → Request form page...')
    const requestFormItems = await extractRequestFormPage()

    const allItems = [...servicesItems, ...requestFormItems]

    console.log(`\n✓ Extracted ${allItems.length} pricing items\n`)

    console.log('📝 Generating markdown document...')
    const markdown = await generateMarkdown(allItems)

    const outputPath = path.join(process.cwd(), 'docs/PRICES_TO_REVIEW.md')

    // Ensure docs directory exists
    await fs.mkdir(path.dirname(outputPath), { recursive: true })

    await fs.writeFile(outputPath, markdown, 'utf-8')

    console.log(`\n✓ Generated: ${outputPath}`)
    console.log(`\n📊 Summary:`)
    console.log(`   - Total items: ${allItems.length}`)
    console.log(`   - Services: ${servicesItems.length}`)
    console.log(`   - Request form: ${requestFormItems.length}`)
    console.log(`\n✨ Done!\n`)
  } catch (error) {
    console.error('❌ Error generating pricing review:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
