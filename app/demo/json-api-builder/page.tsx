'use client'

export const dynamic = "force-dynamic";

import { useState, useRef } from 'react'
import { DemoHero } from '../_components/DemoHero'
import { DemoTabs } from '../_components/DemoTabs'
import { TerminalSimulator } from '../_components/TerminalSimulator'
import { BrowserPreview } from '../_components/BrowserPreview'
import { ConfigPlayground } from '../_components/ConfigPlayground'
import { AccordionFAQ } from '../_components/AccordionFAQ'
import {
  PRODUCT_CONFIG,
  TERMINAL_COMMANDS,
  INVALID_COMMAND_MESSAGE,
  SCRIPT_COMMANDS,
  DEFAULT_CONFIG,
  FAQ_ITEMS,
} from './config'

export default function JsonApiBuilderDemoPage() {
  const [browserUrl, setBrowserUrl] = useState('http://localhost:3000/')
  const [browserContent, setBrowserContent] = useState(
    `{ "name": "json-api-builder", "resources": ["users", "posts"] }`
  )
  const demoTabRef = useRef<HTMLDivElement>(null)

  const handleCommandRun = (command: string, output: string) => {
    if (command.includes('curl http://localhost:3000/health')) {
      setBrowserUrl('http://localhost:3000/health')
      setBrowserContent('{"ok":true}')
    } else if (command.includes('curl http://localhost:3000/users')) {
      setBrowserUrl('http://localhost:3000/users')
      setBrowserContent('[]')
    }
  }

  const scrollToDemo = () => {
    demoTabRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <div className="space-y-6">
          <div className="prose max-w-none">
            <h2>What is json-api-builder?</h2>
            <p>
              json-api-builder is a lightweight CLI tool that reads a JSON configuration file and
              instantly spins up a working CRUD API server. No framework setup, no database
              configuration, no boilerplate—just a JSON file and a single command.
            </p>
            <p>
              It's built for frontend developers, indie builders, and teams who need a backend
              <em> now</em> for prototyping, dashboards, internal tools, or rapid iteration. You
              define your resources and fields in JSON, and the tool generates REST endpoints with
              basic validation and optional file persistence.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Example Response</h3>
            <BrowserPreview url="http://localhost:3000/health" content='{"ok":true}' />
          </div>
        </div>
      ),
    },
    {
      id: 'demo',
      label: 'Demo',
      content: (
        <div ref={demoTabRef} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Interactive Terminal</h3>
              <TerminalSimulator
                commands={TERMINAL_COMMANDS}
                invalidCommandMessage={INVALID_COMMAND_MESSAGE}
                onCommandRun={handleCommandRun}
                scriptCommands={SCRIPT_COMMANDS}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
              <BrowserPreview url={browserUrl} content={browserContent} />
            </div>
          </div>

          <div className="divider">Config Playground</div>

          <ConfigPlayground defaultConfig={DEFAULT_CONFIG} />
        </div>
      ),
    },
    {
      id: 'install',
      label: 'Install',
      content: (
        <div className="space-y-6">
          <div className="prose max-w-none">
            <h2>Installation</h2>
            <p>
              <strong>Requirements:</strong> Node.js 18 or higher
            </p>
          </div>

          <div className="mockup-code">
            <pre data-prefix="$">
              <code>npm install</code>
            </pre>
            <pre data-prefix="$">
              <code>npm run dev -- init</code>
            </pre>
            <pre data-prefix="$">
              <code>npm run dev -- dev --config api.config.json</code>
            </pre>
          </div>

          <div className="alert alert-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>
              Works on Linux and Windows. macOS support is currently in beta testing.
            </span>
          </div>

          <div className="prose max-w-none">
            <h3>Quick Start</h3>
            <ol>
              <li>Clone or download the repository</li>
              <li>
                Run <code>npm install</code> to install dependencies
              </li>
              <li>
                Run <code>npm run dev -- init</code> to create a starter config
              </li>
              <li>
                Edit <code>api.config.json</code> to define your resources
              </li>
              <li>
                Run <code>npm run dev -- dev --config api.config.json</code> to start the server
              </li>
              <li>
                Open <code>http://localhost:3000</code> in your browser or use curl/Postman
              </li>
            </ol>
          </div>
        </div>
      ),
    },
    {
      id: 'faq',
      label: 'FAQ',
      content: (
        <div>
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <AccordionFAQ items={FAQ_ITEMS} />
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen">
      <DemoHero
        title={PRODUCT_CONFIG.title}
        subtitle={PRODUCT_CONFIG.subtitle}
        badges={PRODUCT_CONFIG.badges}
        primaryCta={{
          label: 'Try the demo',
          onClick: scrollToDemo,
        }}
        secondaryCta={{
          label: 'View on GitHub',
          href: PRODUCT_CONFIG.githubUrl,
        }}
      />

      <div className="container mx-auto px-4 py-16">
        <DemoTabs tabs={tabs} defaultTab="overview" />
      </div>
    </div>
  )
}
