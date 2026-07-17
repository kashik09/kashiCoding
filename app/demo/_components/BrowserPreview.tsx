'use client'

export interface BrowserPreviewProps {
  url: string
  content: string
  label?: string
}

export function BrowserPreview({ url, content, label = 'Browser Preview (simulated)' }: BrowserPreviewProps) {
  return (
    <div className="space-y-2">
      <div className="text-sm text-base-content/60">{label}</div>
      <div className="mockup-browser border border-base-300 bg-base-100">
        <div className="mockup-browser-toolbar">
          <div className="input font-mono text-sm">{url}</div>
        </div>
        <div className="bg-base-200 p-6 font-mono text-sm">
          <pre className="whitespace-pre-wrap">{content}</pre>
        </div>
      </div>
    </div>
  )
}
