#!/usr/bin/env tsx
/**
 * Update Pricing Script
 *
 * Applies bulk pricing updates from a JSON pricing map file.
 *
 * Usage:
 *   npx tsx scripts/ts/update-prices.ts <pricing-map.json>
 *   npx tsx scripts/ts/update-prices.ts --dry-run <pricing-map.json>
 *
 * Pricing Map Format:
 * {
 *   "updates": [
 *     {
 *       "id": "web-dev",
 *       "value": 600,
 *       "prefix": "Starting at"
 *     },
 *     {
 *       "id": "membership-pro",
 *       "value": 1599
 *     }
 *   ]
 * }
 */

import fs from 'fs/promises'
import path from 'path'

const PRICING_PATH = path.join(process.cwd(), 'public/content/pricing.json')

interface PricingItem {
  id: string
  name: string
  value: number
  prefix?: string
  suffix?: string
  displayFormat: string
  description: string
  category: string
  active: boolean
  metadata?: Record<string, any>
}

interface PricingData {
  version: string
  lastUpdated: string
  currency: string
  items: Record<string, PricingItem>
  notes?: string[]
}

interface PricingUpdate {
  id: string
  value?: number
  prefix?: string
  suffix?: string
  description?: string
  active?: boolean
}

interface PricingMap {
  updates: PricingUpdate[]
  notes?: string
}

function formatPrice(value: number, prefix?: string, suffix?: string): string {
  const formattedValue = new Intl.NumberFormat('en-US').format(value)
  return `${prefix ? prefix + ' ' : ''}$${formattedValue}${suffix || ''}`
}

async function loadPricingData(): Promise<PricingData> {
  const content = await fs.readFile(PRICING_PATH, 'utf-8')
  return JSON.parse(content)
}

async function savePricingData(data: PricingData): Promise<void> {
  await fs.writeFile(PRICING_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

async function loadPricingMap(filePath: string): Promise<PricingMap> {
  const content = await fs.readFile(filePath, 'utf-8')
  return JSON.parse(content)
}

async function applyUpdates(
  data: PricingData,
  updates: PricingUpdate[],
  dryRun: boolean = false
): Promise<{ updated: number; errors: string[] }> {
  let updated = 0
  const errors: string[] = []

  console.log(`\n${dryRun ? '🔍 DRY RUN - No changes will be saved' : '✏️  Applying updates'}...\n`)

  for (const update of updates) {
    const item = data.items[update.id]

    if (!item) {
      errors.push(`Item not found: ${update.id}`)
      console.log(`❌ Item not found: ${update.id}`)
      continue
    }

    console.log(`📝 Updating: ${item.name} (${update.id})`)

    const oldValues: Record<string, any> = {}
    const newValues: Record<string, any> = {}

    // Track changes
    if (update.value !== undefined && update.value !== item.value) {
      oldValues.value = item.value
      newValues.value = update.value
      item.value = update.value
    }

    if (update.prefix !== undefined && update.prefix !== item.prefix) {
      oldValues.prefix = item.prefix || '(none)'
      newValues.prefix = update.prefix || '(none)'
      item.prefix = update.prefix
    }

    if (update.suffix !== undefined && update.suffix !== item.suffix) {
      oldValues.suffix = item.suffix || '(none)'
      newValues.suffix = update.suffix || '(none)'
      item.suffix = update.suffix
    }

    if (update.description !== undefined && update.description !== item.description) {
      oldValues.description = item.description
      newValues.description = update.description
      item.description = update.description
    }

    if (update.active !== undefined && update.active !== item.active) {
      oldValues.active = item.active
      newValues.active = update.active
      item.active = update.active
    }

    // Regenerate display format if price-related fields changed
    if (update.value !== undefined || update.prefix !== undefined || update.suffix !== undefined) {
      const oldDisplayFormat = item.displayFormat
      item.displayFormat = formatPrice(item.value, item.prefix, item.suffix)

      if (oldDisplayFormat !== item.displayFormat) {
        oldValues.displayFormat = oldDisplayFormat
        newValues.displayFormat = item.displayFormat
      }
    }

    // Show changes
    if (Object.keys(newValues).length > 0) {
      console.log('   Changes:')
      for (const [key, newValue] of Object.entries(newValues)) {
        console.log(`     ${key}: ${oldValues[key]} → ${newValue}`)
      }
      updated++
    } else {
      console.log('   ℹ️  No changes (values already match)')
    }

    console.log('')
  }

  // Update metadata
  if (!dryRun && updated > 0) {
    data.lastUpdated = new Date().toISOString()
  }

  return { updated, errors }
}

async function main() {
  const args = process.argv.slice(2)

  // Check for dry-run flag
  let dryRun = false
  let mapFilePath = ''

  if (args.includes('--dry-run') || args.includes('-d')) {
    dryRun = true
    mapFilePath = args.find(arg => !arg.startsWith('-')) || ''
  } else {
    mapFilePath = args[0] || ''
  }

  // Validate arguments
  if (!mapFilePath) {
    console.error(`
❌ Error: Missing pricing map file

Usage:
  npx tsx scripts/ts/update-prices.ts <pricing-map.json>
  npx tsx scripts/ts/update-prices.ts --dry-run <pricing-map.json>

Example pricing map format:
  {
    "updates": [
      {
        "id": "web-dev",
        "value": 600,
        "prefix": "Starting at"
      },
      {
        "id": "membership-pro",
        "value": 1599
      }
    ]
  }
`)
    process.exit(1)
  }

  try {
    // Load pricing data
    console.log('📂 Loading pricing data...')
    const data = await loadPricingData()
    console.log(`✓ Loaded ${Object.keys(data.items).length} pricing items\n`)

    // Load pricing map
    console.log(`📂 Loading pricing map from: ${mapFilePath}`)
    const map = await loadPricingMap(mapFilePath)
    console.log(`✓ Loaded ${map.updates.length} updates`)

    if (map.notes) {
      console.log(`ℹ️  Note: ${map.notes}`)
    }

    // Apply updates
    const result = await applyUpdates(data, map.updates, dryRun)

    // Save if not dry run
    if (!dryRun && result.updated > 0) {
      console.log('💾 Saving changes...')
      await savePricingData(data)
      console.log('✓ Pricing data saved\n')
    }

    // Summary
    console.log('━'.repeat(50))
    console.log(`\n📊 Summary:`)
    console.log(`   Total updates in map: ${map.updates.length}`)
    console.log(`   Successfully updated: ${result.updated}`)
    console.log(`   Errors: ${result.errors.length}`)

    if (result.errors.length > 0) {
      console.log(`\n❌ Errors:`)
      for (const error of result.errors) {
        console.log(`   - ${error}`)
      }
    }

    if (dryRun) {
      console.log(`\n⚠️  DRY RUN - No changes were saved`)
      console.log(`   Run without --dry-run to apply changes\n`)
    } else if (result.updated > 0) {
      console.log(`\n✨ Pricing updated successfully!\n`)
      console.log(`📝 Next steps:`)
      console.log(`   1. Regenerate pricing review: npx tsx scripts/ts/generate-pricing-review.ts`)
      console.log(`   2. Review changes in: public/content/pricing.json`)
      console.log(`   3. Verify changes in admin: /admin/content/pricing\n`)
    } else {
      console.log(`\nℹ️  No changes were made (all values already match)\n`)
    }
  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : 'Unknown error')
    process.exit(1)
  }
}

main()
