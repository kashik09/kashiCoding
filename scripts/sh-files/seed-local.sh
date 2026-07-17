#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ ! -f ".env.local" ]]; then
  echo "Missing .env.local in repo root."
  exit 1
fi

echo "=== Seeding LOCAL Docker database ==="

# Load .env.local
set -a
source .env.local
set +a

echo "Using database: $POSTGRES_URL_NON_POOLING"
echo ""

# Run seed with local env
exec env -i \
  PATH="$PATH" \
  HOME="$HOME" \
  USER="$USER" \
  POSTGRES_PRISMA_URL="$POSTGRES_PRISMA_URL" \
  POSTGRES_URL_NON_POOLING="$POSTGRES_URL_NON_POOLING" \
  DATABASE_URL="$DATABASE_URL" \
  npm run db:seed
