import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthEnvStatus } from '@/lib/auth-env'

export const dynamic = 'force-dynamic'

export async function GET() {
  const headers = { 'Cache-Control': 'no-store' }
  const envStatus = getAuthEnvStatus()
  let envOk = envStatus.ok
  let dbOk = false
  let providers: string[] = []

  try {
    if (envOk) {
      const { authOptions } = await import('@/lib/auth-options')
      providers = authOptions.providers.map((provider: any) => provider.id || provider.name)
    }
  } catch {
    envOk = false
  }

  try {
    await prisma.$queryRaw`SELECT 1`
    dbOk = true
  } catch {
    dbOk = false
  }

  const ok = envOk && dbOk

  return NextResponse.json(
    {
      ok,
      providers,
      envOk,
      dbOk,
    },
    { headers }
  )
}
