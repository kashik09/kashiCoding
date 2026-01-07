'use client'

import { useState } from 'react'

export interface ConfigPlaygroundProps {
  defaultConfig: string
  onValidate?: (isValid: boolean, data?: any) => void
}

export function ConfigPlayground({ defaultConfig, onValidate }: ConfigPlaygroundProps) {
  const [config, setConfig] = useState(defaultConfig)
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean
    message: string
    data?: any
  } | null>(null)

  const handleValidate = () => {
    try {
      const parsed = JSON.parse(config)
      setValidationResult({
        isValid: true,
        message: 'Valid JSON configuration ✅',
        data: parsed,
      })
      onValidate?.(true, parsed)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid JSON'
      setValidationResult({
        isValid: false,
        message: `Invalid JSON ❌: ${message}`,
      })
      onValidate?.(false)
    }
  }

  const generateRoutes = () => {
    if (!validationResult?.isValid || !validationResult.data?.resources) {
      return []
    }
    const resources = Object.keys(validationResult.data.resources)
    return resources.flatMap((resource) => [
      `GET /${resource}`,
      `GET /${resource}/:id`,
      `POST /${resource}`,
      `PATCH /${resource}/:id`,
      `DELETE /${resource}/:id`,
    ])
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="label">
          <span className="label-text font-semibold">API Configuration (api.config.json)</span>
        </label>
        <textarea
          value={config}
          onChange={(e) => setConfig(e.target.value)}
          className="textarea textarea-bordered w-full font-mono text-sm h-64"
          placeholder="Paste your JSON config here..."
        />
      </div>

      <button onClick={handleValidate} className="btn btn-primary">
        Validate Config
      </button>

      {validationResult && (
        <div
          className={`alert ${validationResult.isValid ? 'alert-success' : 'alert-error'}`}
        >
          <span>{validationResult.message}</span>
        </div>
      )}

      {validationResult?.isValid && generateRoutes().length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Generated Routes</h3>
          <div className="mockup-code">
            {generateRoutes().map((route, idx) => (
              <pre key={idx} data-prefix={idx + 1}>
                <code>{route}</code>
              </pre>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
