import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? parseInt(limitParam, 10) : undefined

    const projects = await prisma.project.findMany({
      where: {
        featured: true,
        published: true
      },
      orderBy: [
        { createdAt: 'desc' }
      ],
      take: limit,
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        thumbnail: true,
        techStack: true,
        tags: true,
        category: true,
        githubUrl: true,
        liveUrl: true,
        featured: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      success: true,
      data: projects,
      count: projects.length
    })
  } catch (error) {
    console.error('Error fetching featured projects:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch featured projects'
      },
      { status: 500 }
    )
  }
}
