type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, unknown>
  error?: Error
  userId?: string
  url?: string
  userAgent?: string
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  private formatLogEntry(entry: LogEntry): string {
    const { timestamp, level, message, context } = entry
    let formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`

    if (context && Object.keys(context).length > 0) {
      formattedMessage += `\nContext: ${JSON.stringify(context, null, 2)}`
    }

    if (entry.error) {
      formattedMessage += `\nError: ${entry.error.message}`
      if (entry.error.stack) {
        formattedMessage += `\nStack: ${entry.error.stack}`
      }
    }

    if (entry.url) {
      formattedMessage += `\nURL: ${entry.url}`
    }

    if (entry.userAgent) {
      formattedMessage += `\nUser Agent: ${entry.userAgent}`
    }

    return formattedMessage
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
    }
  }

  private log(entry: LogEntry): void {
    const formattedMessage = this.formatLogEntry(entry)

    // Console logging
    switch (entry.level) {
      case 'error':
        console.error(formattedMessage)
        break
      case 'warn':
        console.warn(formattedMessage)
        break
      case 'debug':
        if (this.isDevelopment) {
          console.debug(formattedMessage)
        }
        break
      default:
        console.log(formattedMessage)
    }

    // In production, send to external logging service
    if (!this.isDevelopment) {
      this.sendToExternalService(entry)
    }
  }

  private async sendToExternalService(entry: LogEntry): Promise<void> {
    try {
      // In production, integrate with services like:
      // - Sentry
      // - LogRocket
      // - Datadog
      // - CloudWatch
      // Example:
      // await fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(entry),
      // })
    } catch (error) {
      console.error('Failed to send log to external service:', error)
    }
  }

  info(message: string, context?: Record<string, unknown>): void {
    const entry = this.createLogEntry('info', message, context)
    this.log(entry)
  }

  warn(message: string, context?: Record<string, unknown>): void {
    const entry = this.createLogEntry('warn', message, context)
    this.log(entry)
  }

  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    const entry = this.createLogEntry('error', message, context, error)
    this.log(entry)
  }

  debug(message: string, context?: Record<string, unknown>): void {
    const entry = this.createLogEntry('debug', message, context)
    this.log(entry)
  }

  // Convenience methods for common scenarios
  apiError(endpoint: string, error: Error, context?: Record<string, unknown>): void {
    this.error(`API Error: ${endpoint}`, error, {
      ...context,
      endpoint,
      errorMessage: error.message,
    })
  }

  authError(action: string, error: Error, context?: Record<string, unknown>): void {
    this.error(`Auth Error: ${action}`, error, {
      ...context,
      action,
      errorMessage: error.message,
    })
  }

  validationError(field: string, value: unknown, message: string): void {
    this.warn(`Validation Error: ${field}`, {
      field,
      value,
      message,
    })
  }

  performanceLog(metric: string, duration: number, context?: Record<string, unknown>): void {
    this.info(`Performance: ${metric}`, {
      ...context,
      metric,
      duration,
      durationMs: `${duration}ms`,
    })
  }
}

export const logger = new Logger()

// Client-side error boundary helper
export function logErrorBoundary(error: Error, errorInfo: { componentStack: string }): void {
  logger.error('React Error Boundary', error, {
    componentStack: errorInfo.componentStack,
  })
}

// API route error helper
export function logApiError(
  method: string,
  path: string,
  error: Error,
  statusCode?: number
): void {
  logger.apiError(path, error, {
    method,
    statusCode,
  })
}

// Database error helper
export function logDatabaseError(operation: string, model: string, error: Error): void {
  logger.error(`Database Error: ${operation}`, error, {
    operation,
    model,
  })
}
