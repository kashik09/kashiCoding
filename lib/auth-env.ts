function getEnv(name: string): string | null {
  const value = process.env[name]
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  return trimmed.length ? trimmed : null
}

function requireEnv(name: string): string {
  const value = getEnv(name)
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

function ensurePairedEnv(left: string, right: string, missing: string[]): void {
  const leftValue = getEnv(left)
  const rightValue = getEnv(right)

  if ((leftValue && !rightValue) || (!leftValue && rightValue)) {
    missing.push(leftValue ? right : left)
  }
}

export function validateAuthEnv(): void {
  requireEnv("NEXTAUTH_SECRET")
  requireEnv("NEXTAUTH_URL")
  requireEnv("POSTGRES_PRISMA_URL")

  const missing: string[] = []
  ensurePairedEnv("GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", missing)
  ensurePairedEnv("GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET", missing)

  if (missing.length) {
    throw new Error(`Missing required environment variable: ${missing[0]}`)
  }
}

export function getAuthEnvStatus(): { ok: boolean } {
  const missing: string[] = []

  if (!getEnv("NEXTAUTH_SECRET")) missing.push("NEXTAUTH_SECRET")
  if (!getEnv("NEXTAUTH_URL")) missing.push("NEXTAUTH_URL")
  if (!getEnv("POSTGRES_PRISMA_URL")) missing.push("POSTGRES_PRISMA_URL")

  ensurePairedEnv("GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", missing)
  ensurePairedEnv("GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET", missing)

  return { ok: missing.length === 0 }
}
