import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { isValidEmail } from '@/lib/auth-utils'

const prismaClient = prisma as any

type IncomingBody = {
  name?: string
  email?: string
  phone?: string
  message?: string
  orderNumber?: string
  pageUrl?: string
}

const MIN_MESSAGE_LENGTH = 10
const MAX_MESSAGE_LENGTH = 2000

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    const body = (await request.json().catch(() => null)) as IncomingBody | null

    if (!body) {
      return NextResponse.json(
        { error: 'Message is required.' },
        { status: 400 }
      )
    }

    const message = typeof body.message === 'string' ? body.message.trim() : ''
    if (message.length < MIN_MESSAGE_LENGTH || message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: 'Message length is invalid.' },
        { status: 400 }
      )
    }

    const emailInput =
      typeof body.email === 'string' ? body.email.trim() : ''
    if (emailInput && !isValidEmail(emailInput)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      )
    }

    const sessionName =
      typeof session?.user?.name === 'string' ? session.user.name.trim() : ''
    const sessionEmail =
      typeof session?.user?.email === 'string' ? session.user.email.trim() : ''

    const name = (body.name?.trim() || sessionName) || null
    const email = (emailInput || sessionEmail) || null
    const phone =
      typeof body.phone === 'string' && body.phone.trim()
        ? body.phone.trim()
        : null
    const orderNumber =
      typeof body.orderNumber === 'string' && body.orderNumber.trim()
        ? body.orderNumber.trim()
        : null

    const referer = request.headers.get('referer') || ''
    const pageUrlRaw =
      typeof body.pageUrl === 'string' && body.pageUrl.trim()
        ? body.pageUrl.trim()
        : referer
    const pageUrl = pageUrlRaw ? pageUrlRaw.slice(0, 500) : null

    await prismaClient.grievance.create({
      data: {
        name,
        email,
        phone,
        message,
        orderNumber,
        pageUrl,
        userId: session?.user?.id || null,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('POST /api/grievances error:', error)
    return NextResponse.json(
      { error: 'Failed to submit grievance.' },
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
