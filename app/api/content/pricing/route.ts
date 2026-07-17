import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const PRICING_PATH = path.join(process.cwd(), 'public/content/pricing.json')

export async function GET() {
  try {
    const fileContent = await fs.readFile(PRICING_PATH, 'utf-8')
    const data = JSON.parse(fileContent)

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error reading pricing content:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load pricing',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate structure
    if (!body.items || typeof body.items !== 'object') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid pricing structure. Required field: items (object)'
        },
        { status: 400 }
      )
    }

    // Update metadata
    const updatedContent = {
      ...body,
      version: body.version || '1.0',
      lastUpdated: new Date().toISOString()
    }

    // Write to file with pretty formatting
    await fs.writeFile(
      PRICING_PATH,
      JSON.stringify(updatedContent, null, 2),
      'utf-8'
    )

    return NextResponse.json({
      success: true,
      message: 'Pricing updated successfully',
      data: updatedContent
    })
  } catch (error) {
    console.error('Error updating pricing content:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update pricing',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
