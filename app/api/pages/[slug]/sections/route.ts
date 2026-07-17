import { NextRequest, NextResponse } from 'next/server'

// DISABLED: Pages CMS has been removed
const goneResponse = () => NextResponse.json(
  {
    success: false,
    error: 'This endpoint has been removed. Pages CMS is no longer available.'
  },
  { status: 410 }
)

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  return goneResponse()
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  return goneResponse()
}
