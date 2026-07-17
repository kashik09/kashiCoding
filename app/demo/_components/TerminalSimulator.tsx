'use client'

import { useState } from 'react'

export interface TerminalCommand {
  command: string
  output: string
}

export interface TerminalSimulatorProps {
  commands: Record<string, string>
  invalidCommandMessage: string
  onCommandRun?: (command: string, output: string) => void
  scriptCommands?: string[]
}

export function TerminalSimulator({
  commands,
  invalidCommandMessage,
  onCommandRun,
  scriptCommands = [],
}: TerminalSimulatorProps) {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<TerminalCommand[]>([])

  const runCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim()
    if (!trimmedCmd) return

    const output = commands[trimmedCmd] || invalidCommandMessage
    const newEntry = { command: trimmedCmd, output }

    setHistory((prev) => [...prev, newEntry])
    setInput('')
    onCommandRun?.(trimmedCmd, output)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    runCommand(input)
  }

  const handleClear = () => {
    setHistory([])
  }

  const handleReplay = () => {
    setHistory([])
    scriptCommands.forEach((cmd, idx) => {
      setTimeout(() => {
        const output = commands[cmd] || invalidCommandMessage
        setHistory((prev) => [...prev, { command: cmd, output }])
        onCommandRun?.(cmd, output)
      }, idx * 800)
    })
  }

  return (
    <div className="space-y-4">
      <div className="mockup-code bg-neutral text-neutral-content min-h-[400px] max-h-[600px] overflow-y-auto">
        {history.length === 0 && (
          <pre data-prefix="$" className="text-success">
            <code>Ready. Type a command or run the script.</code>
          </pre>
        )}
        {history.map((entry, idx) => (
          <div key={idx}>
            <pre data-prefix="$" className="text-warning">
              <code>{entry.command}</code>
            </pre>
            <pre data-prefix=">" className="text-info whitespace-pre-wrap">
              <code>{entry.output}</code>
            </pre>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a command..."
          className="input input-bordered flex-1 font-mono text-sm"
        />
        <button type="submit" className="btn btn-primary">
          Run
        </button>
        <button type="button" onClick={handleClear} className="btn btn-ghost">
          Clear
        </button>
        {scriptCommands.length > 0 && (
          <button type="button" onClick={handleReplay} className="btn btn-secondary">
            Replay Script
          </button>
        )}
      </form>
    </div>
  )
}
