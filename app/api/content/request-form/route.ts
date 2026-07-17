import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import fs from 'fs/promises'
import path from 'path'
import { prisma } from '@/lib/prisma'

const FALLBACK_PATH = path.join(process.cwd(), 'public/content/request-form.json')

export async function GET() {
  try {
    // Try to read from database first
    const pageContent = await prisma.pageContent.findUnique({
      where: { slug: 'request-form' }
    })

    if (pageContent) {
      return NextResponse.json(pageContent.data)
    }

    // Fallback to JSON file if DB entry doesn't exist
    console.warn('Request form content not found in DB, falling back to JSON file')
    const fileContent = await fs.readFile(FALLBACK_PATH, 'utf-8')
    const data = JSON.parse(fileContent)

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error reading request form content:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load content',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate that the data has the expected structure
    if (!body.header || !body.fields || !body.placeholders || !body.labels) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid content structure. Required fields: header, fields, placeholders, labels'
        },
        { status: 400 }
      )
    }

    // Update metadata
    const updatedContent = {
      ...body,
      metadata: {
        ...body.metadata,
        lastUpdated: new Date().toISOString(),
        version: body.metadata?.version || '1.0'
      }
    }

    // Write to database
    const result = await prisma.pageContent.upsert({
      where: { slug: 'request-form' },
      create: {
        slug: 'request-form',
        data: updatedContent,
        version: updatedContent.metadata.version
      },
      update: {
        data: updatedContent,
        version: updatedContent.metadata.version
      }
    })

    // Revalidate the request page cache
    revalidatePath('/request')
    revalidatePath('/admin/content/request-form')

    return NextResponse.json({
      success: true,
      message: 'Content updated successfully',
      data: updatedContent
    })
  } catch (error) {
    console.error('Error updating request form content:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update content',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
