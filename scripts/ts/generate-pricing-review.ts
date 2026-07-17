#!/usr/bin/env tsx
/**
 * Generate PRICING_REVIEW.md
 *
 * This script extracts all pricing information from:
 * - Services content (public/content/services.json)
 * - Request form content (public/content/request-form.json)
 *
 * And generates a comprehensive pricing review document.
 */

import fs from 'fs/promises'
import path from 'path'

interface PricingItem {
  service: string
  currentPrice: string
  location: string
  type: 'service' | 'budget-range' | 'faq'
  notes?: string
}

interface ServiceData {
  header: { title: string; subtitle: string }
  services: Array<{
    id: string
    title: string
    pricing: string
  }>
  cta: {
    heading: string
    text: string
    buttonText: string
  }
  faq: Array<{
    id: string
    question: string
    answer: string
  }>
}

interface RequestFormData {
  header: { title: string; subtitle: string }
  fields: {
    budgetRanges: Array<{ value: string; label: string }>
  }
}

async function extractServicesPricing(): Promise<PricingItem[]> {
  const filePath = path.join(process.cwd(), 'public/content/services.json')
  const content = await fs.readFile(filePath, 'utf-8')
  const data: ServiceData = JSON.parse(content)

  const items: PricingItem[] = []

  // Extract pricing from services
  for (const service of data.services) {
    items.push({
      service: service.title,
      currentPrice: service.pricing,
      location: `services.json → services[${service.id}].pricing`,
      type: 'service',
      notes: 'Displayed on services page'
    })
  }

  // Check CTAs for pricing mentions
  const ctaText = `${data.cta.heading} ${data.cta.text} ${data.cta.buttonText}`
  if (ctaText.toLowerCase().includes('$') || ctaText.toLowerCase().includes('price') || ctaText.toLowerCase().includes('cost')) {
    items.push({
      service: 'Services CTA',
      currentPrice: ctaText,
      location: 'services.json → cta',
      type: 'service',
      notes: 'CTA section may contain pricing-related text'
    })
  }

  // Check FAQs for pricing mentions
  for (const faq of data.faq) {
    const faqText = `${faq.question} ${faq.answer}`
    if (faqText.includes('$') || faqText.toLowerCase().includes('price') || faqText.toLowerCase().includes('payment') || faqText.toLowerCase().includes('cost')) {
      items.push({
        service: `FAQ: ${faq.question}`,
        currentPrice: faq.answer,
        location: `services.json → faq[${faq.id}]`,
        type: 'faq',
        notes: 'Contains payment/pricing information'
      })
    }
  }

  return items
}

async function extractRequestFormPricing(): Promise<PricingItem[]> {
  const filePath = path.join(process.cwd(), 'public/content/request-form.json')
  const content = await fs.readFile(filePath, 'utf-8')
  const data: RequestFormData = JSON.parse(content)

  const items: PricingItem[] = []

  // Extract budget ranges
  for (const range of data.fields.budgetRanges) {
    items.push({
      service: 'Request Form Budget Range',
      currentPrice: range.label,
      location: `request-form.json → fields.budgetRanges[${range.value}]`,
      type: 'budget-range',
      notes: 'User-selectable budget range in request form'
    })
  }

  return items
}

async function generateMarkdown(allItems: PricingItem[]): Promise<string> {
  const now = new Date().toISOString()

  let md = `# Pricing Review Document\n\n`
  md += `**Generated:** ${now}\n\n`
  md += `---\n\n`

  md += `## Overview\n\n`
  md += `This document provides a comprehensive review of all pricing information across the portfolio site.\n`
  md += `It includes services, budget ranges, and any pricing-related text in CTAs and FAQs.\n\n`

  md += `**Total Pricing Items:** ${allItems.length}\n\n`

  // Group by type
  const grouped = {
    service: allItems.filter(item => item.type === 'service'),
    'budget-range': allItems.filter(item => item.type === 'budget-range'),
    faq: allItems.filter(item => item.type === 'faq')
  }

  md += `- Services: ${grouped.service.length}\n`
  md += `- Budget Ranges: ${grouped['budget-range'].length}\n`
  md += `- FAQ Items: ${grouped.faq.length}\n\n`

  md += `---\n\n`

  // Services Section
  md += `## Services Pricing\n\n`
  if (grouped.service.length > 0) {
    md += `| Service | Current Price | Location | Notes |\n`
    md += `|---------|---------------|----------|-------|\n`
    for (const item of grouped.service) {
      md += `| ${item.service} | ${item.currentPrice} | \`${item.location}\` | ${item.notes || '-'} |\n`
    }
  } else {
    md += `*No service pricing found.*\n`
  }
  md += `\n`

  // Budget Ranges Section
  md += `## Request Form Budget Ranges\n\n`
  if (grouped['budget-range'].length > 0) {
    md += `| Budget Range | Location | Notes |\n`
    md += `|--------------|----------|-------|\n`
    for (const item of grouped['budget-range']) {
      md += `| ${item.currentPrice} | \`${item.location}\` | ${item.notes || '-'} |\n`
    }
  } else {
    md += `*No budget ranges found.*\n`
  }
  md += `\n`

  // FAQ Section
  md += `## Pricing-Related FAQ Items\n\n`
  if (grouped.faq.length > 0) {
    md += `| FAQ Question | Answer/Content | Location | Notes |\n`
    md += `|--------------|----------------|----------|-------|\n`
    for (const item of grouped.faq) {
      const truncatedPrice = item.currentPrice.length > 100
        ? item.currentPrice.substring(0, 100) + '...'
        : item.currentPrice
      md += `| ${item.service} | ${truncatedPrice} | \`${item.location}\` | ${item.notes || '-'} |\n`
    }
  } else {
    md += `*No pricing-related FAQ items found.*\n`
  }
  md += `\n`

  // All Items Table
  md += `---\n\n`
  md += `## Complete Pricing Reference Table\n\n`
  md += `| Service | Current Price | Location | Type | Notes |\n`
  md += `|---------|---------------|----------|------|-------|\n`

  for (const item of allItems) {
    const truncatedPrice = item.currentPrice.length > 50
      ? item.currentPrice.substring(0, 50) + '...'
      : item.currentPrice
    md += `| ${item.service} | ${truncatedPrice} | \`${item.location}\` | ${item.type} | ${item.notes || '-'} |\n`
  }

  md += `\n---\n\n`

  // Currency Analysis
  md += `## Currency Analysis\n\n`
  const currencies = new Set<string>()
  const pricePatterns: { pattern: string; count: number }[] = []

  for (const item of allItems) {
    // Extract currency symbols
    if (item.currentPrice.includes('$')) currencies.add('USD ($)')
    if (item.currentPrice.includes('€')) currencies.add('EUR (€)')
    if (item.currentPrice.includes('£')) currencies.add('GBP (£)')

    // Identify patterns
    if (item.currentPrice.toLowerCase().includes('from')) {
      const existing = pricePatterns.find(p => p.pattern === '"From" pricing')
      if (existing) existing.count++
      else pricePatterns.push({ pattern: '"From" pricing', count: 1 })
    }
    if (item.currentPrice.toLowerCase().includes('starting')) {
      const existing = pricePatterns.find(p => p.pattern === '"Starting at" pricing')
      if (existing) existing.count++
      else pricePatterns.push({ pattern: '"Starting at" pricing', count: 1 })
    }
    if (/^\$\d+$/.test(item.currentPrice)) {
      const existing = pricePatterns.find(p => p.pattern === 'Fixed price (e.g., $500)')
      if (existing) existing.count++
      else pricePatterns.push({ pattern: 'Fixed price (e.g., $500)', count: 1 })
    }
  }

  md += `**Currencies Used:**\n`
  if (currencies.size > 0) {
    for (const currency of Array.from(currencies)) {
      md += `- ${currency}\n`
    }
  } else {
    md += `- None detected\n`
  }

  md += `\n**Pricing Patterns:**\n`
  if (pricePatterns.length > 0) {
    for (const pattern of pricePatterns) {
      md += `- ${pattern.pattern}: ${pattern.count} occurrence(s)\n`
    }
  } else {
    md += `- No patterns detected\n`
  }

  md += `\n---\n\n`

  // Update Instructions
  md += `## How to Update Pricing\n\n`
  md += `### Option 1: Admin Interface (Recommended)\n\n`
  md += `Navigate to \`/admin/content/pricing\` to update all pricing in a structured interface.\n\n`

  md += `### Option 2: Update Script\n\n`
  md += `Run the pricing update script with a JSON pricing map:\n\n`
  md += `\`\`\`bash\n`
  md += `npx tsx scripts/ts/update-prices.ts pricing-map.json\n`
  md += `\`\`\`\n\n`

  md += `### Option 3: Manual File Editing\n\n`
  md += `Edit the JSON files directly:\n`
  md += `- Services: \`public/content/services.json\`\n`
  md += `- Request Form: \`public/content/request-form.json\`\n\n`

  md += `---\n\n`
  md += `*Document generated by \`scripts/ts/generate-pricing-review.ts\`*\n`

  return md
}

async function main() {
  try {
    console.log('🔍 Extracting pricing information...\n')

    console.log('  → Services pricing...')
    const servicesPricing = await extractServicesPricing()

    console.log('  → Request form pricing...')
    const requestFormPricing = await extractRequestFormPricing()

    const allItems = [...servicesPricing, ...requestFormPricing]

    console.log(`\n✓ Extracted ${allItems.length} pricing items\n`)

    console.log('📝 Generating markdown document...')
    const markdown = await generateMarkdown(allItems)

    const outputPath = path.join(process.cwd(), 'docs/PRICING_REVIEW.md')

    // Ensure docs directory exists
    await fs.mkdir(path.dirname(outputPath), { recursive: true })

    await fs.writeFile(outputPath, markdown, 'utf-8')

    console.log(`\n✓ Generated: ${outputPath}`)
    console.log(`\n📊 Summary:`)
    console.log(`   - Total items: ${allItems.length}`)
    console.log(`   - Services: ${servicesPricing.length}`)
    console.log(`   - Request form: ${requestFormPricing.length}`)
    console.log(`\n✨ Done!\n`)
  } catch (error) {
    console.error('❌ Error generating pricing review:', error)
    process.exit(1)
  }
}

main()
