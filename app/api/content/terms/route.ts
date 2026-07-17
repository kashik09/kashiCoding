import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const contentPage = await prisma.contentPage.findUnique({
      where: { slug: 'terms' }
    })

    if (!contentPage) {
      return NextResponse.json(
        {
          success: false,
          error: 'Terms of Service not found'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        title: contentPage.title,
        content: contentPage.content,
        published: contentPage.published,
        lastUpdated: contentPage.updatedAt
      }
    })
  } catch (error) {
    console.error('Error reading terms content:', error)
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

    if (!body.content || !body.title) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid content structure. Required fields: title, content'
        },
        { status: 400 }
      )
    }

    const result = await prisma.contentPage.upsert({
      where: { slug: 'terms' },
      create: {
        slug: 'terms',
        title: body.title,
        type: 'TERMS',
        content: body.content,
        published: body.published ?? true
      },
      update: {
        title: body.title,
        content: body.content,
        published: body.published ?? true
      }
    })

    // Revalidate the terms page cache
    revalidatePath('/legal/terms')
    revalidatePath('/admin/content/legal/terms')

    return NextResponse.json({
      success: true,
      message: 'Terms of Service updated successfully',
      data: {
        title: result.title,
        content: result.content,
        published: result.published,
        lastUpdated: result.updatedAt
      }
    })
  } catch (error) {
    console.error('Error updating terms content:', error)
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
