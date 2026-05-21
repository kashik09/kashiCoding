import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const CONTENT_PATH = path.join(process.cwd(), 'public/content/request-form.json')

export async function GET() {
  try {
    const fileContent = await fs.readFile(CONTENT_PATH, 'utf-8')
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
