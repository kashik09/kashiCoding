import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs/promises'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, getRateLimitHeaders, getRateLimitKey } from '@/lib/rate-limit'
import { generateSmartFilename, sanitizeFilename } from '@/lib/upload-utils'

const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'application/pdf',
])

function isValidAge(value: number) {
  return Number.isFinite(value) && value >= 13 && value <= 18
}

export async function POST(req: Request) {
  try {
    const rateLimit = checkRateLimit(
      getRateLimitKey(req, 'students:verification'),
      5,
      10 * 60 * 1000
    )

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: getRateLimitHeaders(rateLimit) }
      )
    }

    const contentType = req.headers.get('content-type') || ''
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'Content-Type must be multipart/form-data' },
        { status: 415 }
      )
    }

    const formData = await req.formData()
    const name = formData.get('name')?.toString().trim() || ''
    const ageRaw = formData.get('age')?.toString().trim() || ''
    const schoolEmail = formData.get('schoolEmail')?.toString().trim() || ''
    const guardianEmail = formData.get('guardianEmail')?.toString().trim() || ''

    const age = Number(ageRaw)

    if (!name || !schoolEmail || !ageRaw) {
      return NextResponse.json(
        { error: 'Name, age, and school email are required.' },
        { status: 400 }
      )
    }

    if (!isValidAge(age)) {
      return NextResponse.json(
        { error: 'Student verification is limited to ages 13-18.' },
        { status: 400 }
      )
    }

    if (age < 18 && !guardianEmail) {
      return NextResponse.json(
        { error: 'Guardian email is required for applicants under 18.' },
        { status: 400 }
      )
    }

    let storedFilePath: string | null = null
    const idFile = formData.get('idFile')

    if (idFile && idFile instanceof File && idFile.size > 0) {
      if (!ALLOWED_TYPES.has(idFile.type)) {
        return NextResponse.json({ error: 'Unsupported ID file type.' }, { status: 400 })
      }

      if (idFile.size > MAX_BYTES) {
        return NextResponse.json({ error: 'ID file too large (max 5MB).' }, { status: 400 })
      }

      const bytes = await idFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const extension = idFile.type === 'image/jpeg'
        ? 'jpg'
        : idFile.type === 'application/pdf'
          ? 'pdf'
          : idFile.type.split('/')[1]

      const filename = generateSmartFilename({
        originalName: idFile.name,
        prefix: 'student-id',
        extension,
        context: {
          projectTitle: name,
        },
      })
      const safeFilename = sanitizeFilename(filename)

      const uploadDir = path.join(process.cwd(), 'private', 'uploads', 'student-verification')
      await fs.mkdir(uploadDir, { recursive: true })

      const resolvedUploadDir = path.resolve(uploadDir)
      const filePath = path.resolve(uploadDir, safeFilename)
      if (!filePath.startsWith(`${resolvedUploadDir}${path.sep}`)) {
        return NextResponse.json({ error: 'Invalid file path.' }, { status: 400 })
      }

      await fs.writeFile(filePath, buffer)
      storedFilePath = path.join('private', 'uploads', 'student-verification', safeFilename)
    }

    let stored = false

    try {
      const descriptionLines = [
        'Student verification request',
        `Name: ${name}`,
        `Age: ${age}`,
        `School email: ${schoolEmail}`,
        guardianEmail ? `Guardian email: ${guardianEmail}` : 'Guardian email: not provided',
        storedFilePath ? `ID file: ${storedFilePath}` : 'ID file: none',
      ]

      await prisma.projectRequest.create({
        data: {
          name,
          email: schoolEmail,
          description: descriptionLines.join('\n'),
          projectType: 'Student Verification',
          budget: 'Student Discount',
          timeline: 'Verification',
          requirements: guardianEmail || null,
          attachments: storedFilePath ? [storedFilePath] : [],
        },
      })

      stored = true
    } catch (error) {
      console.error('Failed to store student verification request:', error)
      // TODO: enqueue for manual follow-up if database storage fails.
    }

    return NextResponse.json({
      success: true,
      status: 'PENDING',
      stored,
    })
  } catch (error) {
    console.error('Student verification error:', error)
    return NextResponse.json(
      { error: 'Failed to submit verification request.' },
      { status: 500 }
    )
  }
}
