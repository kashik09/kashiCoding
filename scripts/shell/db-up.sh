#!/usr/bin/env bash
set -euo pipefail

CONTAINER_NAME="myportfolio-pg"
DB_NAME="myportfolio"
DB_USER="postgres"
DB_PASSWORD="postgres"
DB_PORT="5432"

echo "=== Checking Docker Postgres container ==="

# Check if container exists
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo "Container $CONTAINER_NAME exists."

  # Check if it's running
  if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "Container is already running."
  else
    echo "Starting existing container..."
    docker start "$CONTAINER_NAME"
  fi
else
  echo "Creating new container $CONTAINER_NAME..."
  docker run -d \
    --name "$CONTAINER_NAME" \
    -e POSTGRES_USER="$DB_USER" \
    -e POSTGRES_PASSWORD="$DB_PASSWORD" \
    -e POSTGRES_DB="$DB_NAME" \
    -p "$DB_PORT:5432" \
    postgres:16

  echo "Waiting for Postgres to initialize..."
  sleep 3
fi

# Wait for Postgres to be ready
echo "Waiting for Postgres to accept connections..."
for i in {1..30}; do
  if docker exec "$CONTAINER_NAME" pg_isready -U "$DB_USER" -d "$DB_NAME" &>/dev/null; then
    echo "✓ Postgres is ready!"
    break
  fi
  if [ "$i" -eq 30 ]; then
    echo "✗ Timeout waiting for Postgres"
    exit 1
  fi
  sleep 1
done

# Sanity check query
echo "Running sanity check query..."
docker exec "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" -c "SELECT version();" | head -n 3

echo ""
echo "=== Docker Postgres is ready ==="
echo "Connection: postgresql://$DB_USER:$DB_PASSWORD@localhost:$DB_PORT/$DB_NAME"
