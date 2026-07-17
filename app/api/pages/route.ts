import { NextRequest, NextResponse } from 'next/server'

// DISABLED: Pages CMS has been removed
// This endpoint is no longer available
export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      error: 'This endpoint has been removed. Pages CMS is no longer available.'
    },
    { status: 410 } // 410 Gone
  )
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      error: 'This endpoint has been removed. Pages CMS is no longer available.'
    },
    { status: 410 } // 410 Gone
  )
}
