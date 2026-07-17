import { chromium } from 'playwright'
import { mkdir } from 'fs/promises'
import { join } from 'path'
import { generateSmartFilename } from '../../lib/upload-utils'

export interface ScreenshotOptions {
  url: string
  outputPath?: string
  filename?: string
  fullPage?: boolean
  viewport?: {
    width: number
    height: number
  }
  delay?: number
  projectSlug?: string
  projectTitle?: string
}

/**
 * Captures a screenshot of a URL using Playwright
 * @returns The public URL path of the saved screenshot
 */
export async function captureProjectScreenshot(
  options: ScreenshotOptions
): Promise<string> {
  const {
    url,
    outputPath = join(process.cwd(), 'public', 'uploads', 'projects'),
    filename,
    fullPage = false,
    viewport = { width: 1920, height: 1080 },
    delay = 2000,
    projectSlug,
    projectTitle
  } = options

  console.log('📸 Starting screenshot capture...')
  console.log('  URL:', url)

  // Ensure output directory exists
  await mkdir(outputPath, { recursive: true })

  // Generate filename if not provided
  const screenshotFilename =
    filename ||
    generateSmartFilename({
      prefix: 'project',
      extension: 'png',
      context: { projectSlug, projectTitle }
    })

  const outputFile = join(outputPath, screenshotFilename)

  // Launch browser
  const browser = await chromium.launch({
    headless: true
  })

  try {
    const context = await browser.newContext({
      viewport,
      deviceScaleFactor: 2
    })

    const page = await context.newPage()

    // Navigate to URL
    console.log('  Navigating to URL...')
    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 30000
    })

    // Wait for additional delay
    if (delay > 0) {
      console.log(`  Waiting ${delay}ms for page to settle...`)
      await page.waitForTimeout(delay)
    }

    // Take screenshot
    console.log('  Capturing screenshot...')
    await page.screenshot({
      path: outputFile,
      fullPage
    })

    console.log('✓ Screenshot saved:', screenshotFilename)

    // Return public URL path
    const publicPath = `/uploads/projects/${screenshotFilename}`
    return publicPath
  } finally {
    await browser.close()
  }
}

// CLI support
async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.log('Usage: npx tsx scripts/ts/capture-screenshot.ts <url> [filename]')
    console.log('')
    console.log('Examples:')
    console.log(
      '  npx tsx scripts/ts/capture-screenshot.ts https://example.com'
    )
    console.log(
      '  npx tsx scripts/ts/capture-screenshot.ts https://example.com my-project.png'
    )
    process.exit(1)
  }

  const url = args[0]
  const filename = args[1]

  try {
    const publicPath = await captureProjectScreenshot({
      url,
      filename
    })

    console.log('')
    console.log('Public URL:', publicPath)
  } catch (error) {
    console.error('Error capturing screenshot:', error)
    process.exit(1)
  }
}

// Run CLI if called directly
if (require.main === module) {
  main()
}
