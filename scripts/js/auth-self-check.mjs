import { spawn } from 'node:child_process'
import { setTimeout as delay } from 'node:timers/promises'

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const port = process.env.AUTH_STATUS_PORT || '4011'
const statusUrl = `http://localhost:${port}/api/auth/status`

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit', ...options })
    child.on('close', (code) => {
      if (code === 0) return resolve()
      reject(new Error(`${command} ${args.join(' ')} failed with code ${code}`))
    })
  })
}

async function waitForStatus() {
  const maxAttempts = 30

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      const response = await fetch(statusUrl, { cache: 'no-store' })
      const json = await response.json().catch(() => null)
      if (
        json &&
        typeof json.ok === 'boolean' &&
        typeof json.envOk === 'boolean' &&
        typeof json.dbOk === 'boolean'
      ) {
        return json
      }
    } catch {
      // Wait and retry while server boots.
    }

    await delay(500)
  }

  throw new Error(`Auth status endpoint did not become ready: ${statusUrl}`)
}

async function main() {
  await run(npmCmd, ['run', 'build'])

  const env = {
    ...process.env,
    PORT: port,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || `http://localhost:${port}`,
  }

  const server = spawn(npmCmd, ['run', 'start'], { env, stdio: 'inherit' })

  const shutdown = () => {
    if (server.killed) return
    server.kill('SIGTERM')
    setTimeout(() => server.kill('SIGKILL'), 5000).unref()
  }

  process.on('exit', shutdown)
  process.on('SIGINT', () => {
    shutdown()
    process.exit(130)
  })
  process.on('SIGTERM', () => {
    shutdown()
    process.exit(143)
  })

  try {
    const status = await waitForStatus()
    if (!status?.ok || !status?.envOk || !status?.dbOk) {
      throw new Error(
        `Auth status check failed (ok=${status.ok}, envOk=${status.envOk}, dbOk=${status.dbOk})`
      )
    }
  } finally {
    shutdown()
  }
}

main().catch((error) => {
  console.error(error?.message || error)
  process.exit(1)
})
