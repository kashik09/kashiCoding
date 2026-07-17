/**
 * Institution Verification Helper Script
 * Usage: npx ts-node scripts/ts/institution-check.ts "University Name" "Country"
 *
 * This script helps with manual student verification by checking
 * if an institution name appears to be legitimate.
 *
 * FREE MVP VERSION: Uses basic heuristics + public data
 * NO PAID APIs REQUIRED
 */

interface InstitutionCheckResult {
  query: string
  country: string
  likelyValid: boolean
  confidence: 'HIGH' | 'MEDIUM' | 'LOW'
  reasons: string[]
  suggestions: string[]
}

// Common educational keywords across languages
const EDUCATIONAL_KEYWORDS = [
  'university',
  'college',
  'institute',
  'school',
  'academy',
  'polytechnic',
  'universidad',
  'universit',
  'école',
  'hochschule',
  'università',
  'universidade',
  'akademi',
  'institut',
]

// Known legitimate university suffixes
const LEGITIMATE_SUFFIXES = [
  'university',
  'college',
  'institute of technology',
  'state university',
  'community college',
  'technical college',
]

// Suspicious patterns
const SUSPICIOUS_PATTERNS = [
  'online',
  'virtual',
  'diploma mill',
  'fake',
  'buy',
  'certificate',
  'instant',
  'fast track',
]

/**
 * Check if institution name appears legitimate
 */
function checkInstitution(institutionName: string, country: string): InstitutionCheckResult {
  const result: InstitutionCheckResult = {
    query: institutionName,
    country,
    likelyValid: false,
    confidence: 'LOW',
    reasons: [],
    suggestions: [],
  }

  const lowerName = institutionName.toLowerCase().trim()

  // Check 1: Contains educational keywords
  const hasEducationalKeyword = EDUCATIONAL_KEYWORDS.some((keyword) =>
    lowerName.includes(keyword)
  )
  if (hasEducationalKeyword) {
    result.reasons.push('✓ Contains educational keyword')
  } else {
    result.reasons.push('✗ No recognizable educational keywords')
  }

  // Check 2: Has legitimate suffix
  const hasLegitSuffix = LEGITIMATE_SUFFIXES.some((suffix) => lowerName.endsWith(suffix))
  if (hasLegitSuffix) {
    result.reasons.push('✓ Has legitimate educational suffix')
  }

  // Check 3: Check for suspicious patterns
  const hasSuspiciousPattern = SUSPICIOUS_PATTERNS.some((pattern) => lowerName.includes(pattern))
  if (hasSuspiciousPattern) {
    result.reasons.push('⚠️  Contains suspicious pattern (online/virtual/instant)')
    result.likelyValid = false
    result.confidence = 'LOW'
    result.suggestions.push(
      'CAUTION: Name contains patterns associated with diploma mills. Verify carefully.'
    )
    return result
  }

  // Check 4: Length check (too short is suspicious)
  if (institutionName.length < 10) {
    result.reasons.push('⚠️  Name is very short (< 10 characters)')
  } else {
    result.reasons.push('✓ Name length is reasonable')
  }

  // Check 5: Has proper capitalization (not all caps or all lowercase)
  const hasProperCaps = /[A-Z]/.test(institutionName) && /[a-z]/.test(institutionName)
  if (hasProperCaps) {
    result.reasons.push('✓ Has proper capitalization')
  } else {
    result.reasons.push('⚠️  Unusual capitalization')
  }

  // Calculate confidence
  let score = 0
  if (hasEducationalKeyword) score += 30
  if (hasLegitSuffix) score += 30
  if (institutionName.length >= 10) score += 20
  if (hasProperCaps) score += 20

  if (score >= 70) {
    result.likelyValid = true
    result.confidence = 'HIGH'
  } else if (score >= 50) {
    result.likelyValid = true
    result.confidence = 'MEDIUM'
  } else {
    result.likelyValid = false
    result.confidence = 'LOW'
  }

  // Add suggestions
  if (result.confidence === 'LOW') {
    result.suggestions.push('Request additional proof (student ID or enrollment letter)')
    result.suggestions.push('Search for the institution website manually')
    result.suggestions.push('Ask student for their student email domain')
  } else if (result.confidence === 'MEDIUM') {
    result.suggestions.push('Verify with student email or ID for confirmation')
  } else {
    result.suggestions.push('Name appears legitimate, but verify documentation')
  }

  return result
}

/**
 * Format and display results
 */
function displayResults(result: InstitutionCheckResult): void {
  console.log('\n' + '='.repeat(60))
  console.log('INSTITUTION VERIFICATION CHECK')
  console.log('='.repeat(60))
  console.log(`Institution: ${result.query}`)
  console.log(`Country: ${result.country}`)
  console.log(`\nLikely Valid: ${result.likelyValid ? '✓ YES' : '✗ NO'}`)
  console.log(`Confidence: ${result.confidence}`)
  console.log('\nAnalysis:')
  result.reasons.forEach((reason) => console.log(`  ${reason}`))

  if (result.suggestions.length > 0) {
    console.log('\nSuggestions:')
    result.suggestions.forEach((suggestion) => console.log(`  • ${suggestion}`))
  }

  console.log('\n' + '='.repeat(60))
  console.log('NOTE: This is a heuristic check only.')
  console.log('Always verify with official documentation.')
  console.log('='.repeat(60) + '\n')
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2)

  if (args.length < 2) {
    console.log('Usage: npx ts-node scripts/ts/institution-check.ts "Institution Name" "Country"')
    console.log('\nExample:')
    console.log('  npx ts-node scripts/ts/institution-check.ts "University of California" "United States"')
    process.exit(1)
  }

  const [institutionName, country] = args
  const result = checkInstitution(institutionName, country)
  displayResults(result)

  // Exit with code based on result
  process.exit(result.likelyValid && result.confidence !== 'LOW' ? 0 : 1)
}

// Run if executed directly
if (require.main === module) {
  main()
}

export { checkInstitution }
export type { InstitutionCheckResult }
