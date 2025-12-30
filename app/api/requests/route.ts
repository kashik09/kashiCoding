import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type IncomingBody = {
  name?: string
  email?: string
  projectType?: string
  budget?: string
  timeline?: string
  description?: string
}

export async function POST(req: Request) {
  try {
    // Check if accepting new requests
    const siteSettings = await prisma.siteSettings.findUnique({
      where: { id: 'site_settings_singleton' },
    })

    if (siteSettings && siteSettings.availableForBusiness === false) {
      return NextResponse.json(
        {
          error:
            'Currently not accepting new project requests. Please check back later or contact directly.',
        },
        { status: 503 }
      )
    }

    const session = await getServerSession()
    const body = (await req.json()) as IncomingBody

    const name = session?.user?.name ?? body.name ?? ''
    const email = session?.user?.email ?? body.email ?? ''

    const projectType = body.projectType ?? ''
    const budget = body.budget ?? ''
    const timeline = body.timeline ?? ''
    const description = body.description ?? ''

    // Hard validation (keep it strict)
    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
    }
    if (!projectType || !budget || !timeline || !description) {
      return NextResponse.json(
        { error: 'Missing required fields.' },
        { status: 400 }
      )
    }

    // Create project request
    const created = await prisma.projectRequest.create({
      data: {
        name,
        email,
        projectType,
        budget,
        timeline,
        description
      }
    })

    return NextResponse.json({ ok: true, request: created }, { status: 201 })
  } catch (err) {
    console.error('POST /api/requests error:', err)
    return NextResponse.json(
      { error: 'Failed to submit request.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed.' },
    { status: 405 }
  )
}
