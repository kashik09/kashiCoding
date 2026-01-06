const ADMIN_SESSION_MAX_AGE_SECONDS = 8 * 60 * 60
const ADMIN_TRUST_DEVICE_DAYS = 7
const ADMIN_TRUST_DEVICE_TTL_SECONDS = ADMIN_TRUST_DEVICE_DAYS * 24 * 60 * 60
const ADMIN_STEPUP_TTL_SECONDS = 15 * 60
const ADMIN_IDLE_TIMEOUT_SECONDS = 45 * 60
const ADMIN_DEVICE_ID_COOKIE = 'admin_device_id'
const ADMIN_TRUST_DEVICE_COOKIE = 'admin_trusted_device'
const ADMIN_STEPUP_COOKIE = 'admin_stepup'
const ADMIN_LAST_ACTIVE_COOKIE = 'admin_last_active'

type HmacPayload = Record<string, unknown> & { exp: number }

const encoder = new TextEncoder()

function getAdminSecuritySecret(): string {
  const secret = process.env.ADMIN_SECURITY_SECRET || process.env.NEXTAUTH_SECRET
  if (!secret) {
    throw new Error('Missing ADMIN_SECURITY_SECRET or NEXTAUTH_SECRET')
  }
  return secret
}

function base64UrlEncode(data: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < data.length; i += 1) {
    const byte = data[i]
    binary += String.fromCharCode(byte)
  }
  const base64 =
    typeof globalThis.btoa === 'function'
      ? globalThis.btoa(binary)
      : Buffer.from(binary, 'binary').toString('base64')
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function base64UrlDecode(input: string): Uint8Array {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/')
  const padLength = (4 - (padded.length % 4)) % 4
  const normalized = padded + '='.repeat(padLength)
  const binary =
    typeof globalThis.atob === 'function'
      ? globalThis.atob(normalized)
      : Buffer.from(normalized, 'base64').toString('binary')
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

async function createHmacSignature(base: string, secret: string): Promise<string> {
  if (!globalThis.crypto?.subtle) {
    throw new Error('WebCrypto is not available in this runtime')
  }
  const key = await globalThis.crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await globalThis.crypto.subtle.sign('HMAC', key, encoder.encode(base))
  return base64UrlEncode(new Uint8Array(signature))
}

export async function createSignedToken<T extends HmacPayload>(
  payload: T,
  secret = getAdminSecuritySecret()
): Promise<string> {
  const base = base64UrlEncode(encoder.encode(JSON.stringify(payload)))
  const signature = await createHmacSignature(base, secret)
  return `${base}.${signature}`
}

export async function verifySignedToken<T extends HmacPayload>(
  token: string,
  secret = getAdminSecuritySecret()
): Promise<T | null> {
  const [base, signature] = token.split('.')
  if (!base || !signature) return null

  const expected = await createHmacSignature(base, secret)
  if (expected !== signature) return null

  try {
    const json = new TextDecoder().decode(base64UrlDecode(base))
    const payload = JSON.parse(json) as T
    if (typeof payload.exp !== 'number') return null
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp < now) return null
    return payload
  } catch {
    return null
  }
}

export async function hashValue(value: string, secret = getAdminSecuritySecret()): Promise<string> {
  const signature = await createHmacSignature(value, secret)
  return signature
}

export function getRequestIp(headers: Headers): string | null {
  const forwarded = headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0]?.trim() : headers.get('x-real-ip')
  return ip || null
}

export function getRequestCountry(headers: Headers): string | null {
  const country = headers.get('x-vercel-ip-country')
  return country || null
}

export {
  ADMIN_SESSION_MAX_AGE_SECONDS,
  ADMIN_TRUST_DEVICE_DAYS,
  ADMIN_TRUST_DEVICE_TTL_SECONDS,
  ADMIN_STEPUP_TTL_SECONDS,
  ADMIN_IDLE_TIMEOUT_SECONDS,
  ADMIN_DEVICE_ID_COOKIE,
  ADMIN_TRUST_DEVICE_COOKIE,
  ADMIN_STEPUP_COOKIE,
  ADMIN_LAST_ACTIVE_COOKIE,
}
