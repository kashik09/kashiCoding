#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ ! -f ".env.local" ]]; then
  echo "Missing .env.local in repo root."
  echo 'Expected POSTGRES_PRISMA_URL and POSTGRES_URL_NON_POOLING.'
  exit 1
fi

set -a
source .env.local
set +a

if [[ -z "${POSTGRES_PRISMA_URL:-}" ]]; then
  echo "POSTGRES_PRISMA_URL is missing in .env.local"
  exit 1
fi

if [[ -z "${POSTGRES_URL_NON_POOLING:-}" ]]; then
  echo "POSTGRES_URL_NON_POOLING is missing in .env.local"
  exit 1
fi

echo "Using POSTGRES_PRISMA_URL host:"
node -e "console.log(new URL(process.env.POSTGRES_PRISMA_URL).host)"

echo "Using POSTGRES_URL_NON_POOLING host:"
node -e "console.log(new URL(process.env.POSTGRES_URL_NON_POOLING).host)"

# Run prisma in a clean env so it cannot pick up .env
exec env -i \
  PATH="$PATH" \
  HOME="$HOME" \
  USER="$USER" \
  POSTGRES_PRISMA_URL="$POSTGRES_PRISMA_URL" \
  POSTGRES_URL_NON_POOLING="$POSTGRES_URL_NON_POOLING" \
  npx prisma "$@"
