export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { captureProjectScreenshot } from '@/scripts/ts/capture-screenshot'
import { chromium } from 'playwright'

// GET /api/admin/screenshot - Check if Playwright is available
export async function GET() {
  try {
    const session = await getServerSession()

    if (
      !session ||
      (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')
    ) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Try to launch and close browser to verify Playwright is available
    try {
      const browser = await chromium.launch({ headless: true })
      await browser.close()

      return NextResponse.json({
        success: true,
        data: { available: true }
      })
    } catch (error) {
      return NextResponse.json({
        success: true,
        data: {
          available: false,
          message: 'Playwright chromium not installed. Run: npx playwright install chromium'
        }
      })
    }
  } catch (error) {
    console.error('Error checking Playwright availability:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to check availability' },
      { status: 500 }
    )
  }
}

// POST /api/admin/screenshot - Capture screenshot
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (
      !session ||
      (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')
    ) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { url, projectSlug, projectTitle, fullPage = false } = body

    // Validate required fields
    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL is required' },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    // Capture screenshot
    const publicPath = await captureProjectScreenshot({
      url,
      projectSlug,
      projectTitle,
      fullPage
    })

    // Extract filename from path
    const filename = publicPath.split('/').pop() || ''

    return NextResponse.json({
      success: true,
      data: {
        url: publicPath,
        filename
      }
    })
  } catch (error) {
    console.error('Error capturing screenshot:', error)
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to capture screenshot'
      },
      { status: 500 }
    )
  }
}
