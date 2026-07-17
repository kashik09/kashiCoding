import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/password'
import { checkRateLimit, getRateLimitHeaders, getRateLimitKey } from '@/lib/rate-limit'
import { getNonEmptyString, isValidEmail, isValidPassword, normalizeEmail } from '@/lib/auth-utils'

export async function POST(request: NextRequest) {
  try {
    const rateLimit = checkRateLimit(
      getRateLimitKey(request, 'auth:signup'),
      5,
      15 * 60 * 1000
    )
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many signup attempts' },
        { status: 429, headers: getRateLimitHeaders(rateLimit) }
      )
    }

    const contentType = request.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 415 }
      )
    }

    const body = await request.json().catch(() => null)
    const name = getNonEmptyString(body?.name)
    const email = normalizeEmail(body?.email)
    const password = typeof body?.password === 'string' ? body.password : ''

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    if (!isValidPassword(password)) {
      return NextResponse.json(
        { error: 'Password must be at least 12 characters with uppercase, lowercase, number, and special character' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER',
        accountStatus: 'ACTIVE'
      }
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully'
      },
      { status: 201 }
    )
  } catch (error) {
    if ((error as { code?: string })?.code === 'P2002') {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }
    console.error('Signup error')
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    )
  }
}
