export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ProjectCategory } from '@prisma/client'
import { projectToPortfolioItem } from '@/lib/portfolio/types'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

    const projects = await prisma.project.findMany({
      where: {
        published: true,
        ...(category && category !== 'ALL' ? { category: category as ProjectCategory } : {}),
      },
      orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }],
      take: limit,
    })

    const items = projects.map(projectToPortfolioItem)

    return NextResponse.json({
      success: true,
      data: items,
    })
  } catch (error) {
    console.error('Error fetching portfolio items:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch portfolio items',
      },
      { status: 500 }
    )
  }
}
