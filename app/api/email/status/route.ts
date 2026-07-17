import { NextResponse } from 'next/server'
import { getResendConfig } from '@/lib/resend'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function getEnv(name: string): string | null {
  const value = process.env[name]
  return typeof value === 'string' && value.trim().length ? value.trim() : null
}

export async function GET() {
  const resendConfig = getResendConfig()
  const resendConfigured = resendConfig.configured
  const testTo = getEnv('RESEND_TEST_TO')

  let canSend = false
  let ok = false

  if (resendConfigured && resendConfig.resend && resendConfig.from) {
    if (testTo) {
      try {
        const { error } = await resendConfig.resend.emails.send({
          from: resendConfig.from,
          to: testTo,
          subject: 'Resend health check',
          html: '<p>Resend is configured.</p>',
        })
        canSend = !error
        ok = !error
      } catch {
        canSend = false
        ok = false
      }
    } else {
      canSend = true
      ok = true
    }
  }

  return NextResponse.json({
    ok,
    resendConfigured,
    canSend,
  })
}
