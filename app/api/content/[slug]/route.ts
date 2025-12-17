import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/content/[slug] - Get published content page
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const page = await prisma.contentPage.findUnique({
      where: {
        slug: params.slug,
        published: true
      }
    })

    if (!page) {
      return NextResponse.json(
        { success: false, error: 'Content page not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: page
    })
  } catch (error) {
    console.error('Error fetching content page:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch content page' },
      { status: 500 }
    )
  }
}
