#!/usr/bin/env node

/**
 * WCAG Contrast Ratio Checker
 *
 * Usage:
 *   node scripts/check-contrast.js <background-color> <text-color>
 *
 * Example:
 *   node scripts/check-contrast.js "oklch(68.628% 0.185 148.958)" "oklch(0% 0 0)"
 *   node scripts/check-contrast.js "#2d6a4f" "#ffffff"
 */

/**
 * Convert OKLCH to RGB
 * Simplified conversion for checking contrast
 */
function oklchToRgb(l, c, h) {
  // This is a simplified conversion
  // For production, use a proper color conversion library
  const a = c * Math.cos((h * Math.PI) / 180)
  const b = c * Math.sin((h * Math.PI) / 180)

  // Convert to linear RGB (simplified)
  const L = l / 100
  const r = L + a * 0.3963377774 + b * 0.2158037573
  const g = L - a * 0.1055613458 - b * 0.0638541728
  const b_val = L - a * 0.0894841775 - b * 1.2914855480

  // Gamma correction (approximate)
  const gamma = (v) => {
    const abs = Math.abs(v)
    if (abs < 0.0031308) return v * 12.92
    return Math.sign(v) * (1.055 * Math.pow(abs, 1/2.4) - 0.055)
  }

  return [
    Math.max(0, Math.min(255, gamma(r) * 255)),
    Math.max(0, Math.min(255, gamma(g) * 255)),
    Math.max(0, Math.min(255, gamma(b_val) * 255))
  ]
}

/**
 * Parse color string to RGB
 */
function parseColor(color) {
  color = color.trim()

  // OKLCH format: oklch(L% C H)
  const oklchMatch = color.match(/oklch\(([\d.]+)%?\s+([\d.]+)\s+([\d.]+)\)/)
  if (oklchMatch) {
    const [, l, c, h] = oklchMatch
    return oklchToRgb(parseFloat(l), parseFloat(c), parseFloat(h))
  }

  // Hex format
  if (color.startsWith('#')) {
    const hex = color.slice(1)
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16)
      const g = parseInt(hex[1] + hex[1], 16)
      const b = parseInt(hex[2] + hex[2], 16)
      return [r, g, b]
    }
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16)
      const g = parseInt(hex.slice(2, 4), 16)
      const b = parseInt(hex.slice(4, 6), 16)
      return [r, g, b]
    }
  }

  // RGB format
  const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
  if (rgbMatch) {
    return [parseInt(rgbMatch[1]), parseInt(rgbMatch[2]), parseInt(rgbMatch[3])]
  }

  throw new Error(`Unable to parse color: ${color}`)
}

/**
 * Calculate relative luminance
 */
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(val => {
    val = val / 255
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/**
 * Calculate contrast ratio
 */
function getContrastRatio(rgb1, rgb2) {
  const lum1 = getLuminance(...rgb1)
  const lum2 = getLuminance(...rgb2)
  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Get WCAG rating
 */
function getWCAGRating(ratio) {
  const ratings = []

  if (ratio >= 7) {
    ratings.push('AAA (normal text)')
    ratings.push('AAA (large text)')
  } else if (ratio >= 4.5) {
    ratings.push('AA (normal text)')
    ratings.push('AAA (large text)')
  } else if (ratio >= 3) {
    ratings.push('AA (large text only)')
  } else {
    ratings.push('❌ FAILS WCAG')
  }

  return ratings
}

// Main execution
const args = process.argv.slice(2)

if (args.length < 2) {
  console.log('Usage: node scripts/check-contrast.js <background-color> <text-color>')
  console.log('')
  console.log('Examples:')
  console.log('  node scripts/check-contrast.js "oklch(68.628% 0.185 148.958)" "oklch(0% 0 0)"')
  console.log('  node scripts/check-contrast.js "#2d6a4f" "#ffffff"')
  console.log('  node scripts/check-contrast.js "rgb(45, 106, 79)" "rgb(255, 255, 255)"')
  process.exit(1)
}

const [bgColor, textColor] = args

try {
  const bg = parseColor(bgColor)
  const fg = parseColor(textColor)

  const ratio = getContrastRatio(bg, fg)
  const ratings = getWCAGRating(ratio)

  console.log('\n📊 Contrast Ratio Analysis')
  console.log('━'.repeat(50))
  console.log(`Background: ${bgColor}`)
  console.log(`  RGB: rgb(${bg.map(v => Math.round(v)).join(', ')})`)
  console.log(`Text Color: ${textColor}`)
  console.log(`  RGB: rgb(${fg.map(v => Math.round(v)).join(', ')})`)
  console.log('')
  console.log(`Contrast Ratio: ${ratio.toFixed(2)}:1`)
  console.log('')
  console.log('WCAG Compliance:')
  ratings.forEach(rating => console.log(`  ${rating}`))
  console.log('')
  console.log('Guidelines:')
  console.log('  • AA (normal): 4.5:1 minimum')
  console.log('  • AA (large):  3:1 minimum')
  console.log('  • AAA (normal): 7:1 minimum')
  console.log('  • AAA (large):  4.5:1 minimum')
  console.log('━'.repeat(50))
  console.log('')

  // Exit with error if fails WCAG
  if (ratio < 3) {
    process.exit(1)
  }
} catch (error) {
  console.error('❌ Error:', error.message)
  process.exit(1)
}
