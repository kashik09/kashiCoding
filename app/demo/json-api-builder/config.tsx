export const PRODUCT_CONFIG = {
  title: 'json-api-builder',
  subtitle: 'CLI tool that turns a JSON config into a working CRUD API server',
  badges: ['CLI', 'TypeScript', 'Fastify', 'Config-driven'],
  githubUrl: 'https://github.com/kashik09/json-api-builder',
}

export const TERMINAL_COMMANDS: Record<string, string> = {
  'json-api-builder --help': `json-api-builder - CLI tool for generating CRUD APIs from JSON config

Usage:
  json-api-builder init                    Create a starter config file
  json-api-builder dev --config <file>     Start the API server

Options:
  --config <file>  Path to config file (required for dev)
  --port <number>  Override port from config
  --help           Show this help message

Examples:
  json-api-builder init
  json-api-builder dev --config api.config.json
  json-api-builder dev --config api.config.json --port 4000`,

  'json-api-builder init': `✓ Created api.config.json

Your starter config is ready. Edit it to define your resources, then run:

  json-api-builder dev --config api.config.json`,

  'json-api-builder dev --config api.config.json': `Starting json-api-builder server...

✓ Config loaded: api.config.json
✓ Resources: users, posts
✓ Server running at http://localhost:3000

Routes:
  GET    /users
  GET    /users/:id
  POST   /users
  PATCH  /users/:id
  DELETE /users/:id

  GET    /posts
  GET    /posts/:id
  POST   /posts
  PATCH  /posts/:id
  DELETE /posts/:id

Press Ctrl+C to stop`,

  'curl http://localhost:3000/health': `{"ok":true}`,

  'curl http://localhost:3000/users': `[]`,
}

export const INVALID_COMMAND_MESSAGE = `Command not recognized. Try: json-api-builder --help`

export const SCRIPT_COMMANDS = [
  'json-api-builder --help',
  'json-api-builder init',
  'json-api-builder dev --config api.config.json',
  'curl http://localhost:3000/health',
  'curl http://localhost:3000/users',
]

export const DEFAULT_CONFIG = `{
  "port": 3000,
  "persist": "memory",
  "resources": {
    "users": {
      "fields": {
        "name": "string",
        "email": "string",
        "age": "number"
      },
      "required": ["name", "email"]
    },
    "posts": {
      "fields": {
        "title": "string",
        "content": "string"
      }
    }
  }
}`

export const FAQ_ITEMS = [
  {
    question: 'Is this a real server?',
    answer:
      'The demo on this page is a browser simulation for educational purposes. The actual json-api-builder CLI runs a real Fastify server on your machine with full CRUD endpoints and optional file persistence.',
  },
  {
    question: 'Does it work on Windows?',
    answer:
      'Yes. json-api-builder works on Linux and Windows with Node.js 18+. macOS support is currently in beta testing. The tool uses standard Node.js APIs and should work across platforms.',
  },
  {
    question: 'Is there persistence?',
    answer:
      'Yes. You can set "persist": "file" in your config to enable file-based storage. Data is saved to a .data/ folder as JSON files and reloaded on restart. The default "memory" mode resets on server restart.',
  },
  {
    question: 'Is it production-ready?',
    answer:
      'No. json-api-builder is designed for prototyping, internal tools, frontend development, and learning. It lacks authentication, authorization, pagination, relations, and other features required for production APIs. Use it to move fast during development, not to replace a proper backend.',
  },
]
