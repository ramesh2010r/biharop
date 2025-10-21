#!/usr/bin/env bash
set -euo pipefail

# Backup Bihar Election Opinion Poll project + MySQL database
# Output: backups/backup-YYYYmmdd-HHMMSS.tar.gz and backups/backup-YYYYmmdd-HHMMSS/db.sql

PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
BACKUPS_DIR="$PROJECT_ROOT/backups"
RUN_DIR="$BACKUPS_DIR/backup-$TIMESTAMP"
mkdir -p "$RUN_DIR"

# Load DB env if present
if [ -f "$PROJECT_ROOT/backend/.env" ]; then
  set +u
  # shellcheck disable=SC1090
  . "$PROJECT_ROOT/backend/.env"
  set -u
fi

# Defaults (match backend/config/database.js)
DB_HOST="${DB_HOST:-localhost}"
DB_USER="${DB_USER:-root}"
DB_PASSWORD="${DB_PASSWORD:-}"
DB_NAME="${DB_NAME:-bihar_election_poll}"
DB_PORT="${DB_PORT:-3306}"

# Check mysqldump availability
if ! command -v mysqldump >/dev/null 2>&1; then
  echo "✗ mysqldump not found. Please install MySQL client tools (e.g., brew install mysql-client) and ensure 'mysqldump' is on PATH." >&2
  exit 1
fi

# Dump the database (no prompt). Prefer MYSQL_PWD to avoid exposing password in ps output
export MYSQL_PWD="$DB_PASSWORD"
echo "→ Dumping MySQL database '$DB_NAME'..."
mysqldump \
  -h "$DB_HOST" \
  -P "$DB_PORT" \
  -u "$DB_USER" \
  --databases "$DB_NAME" \
  --routines --events --single-transaction --quick --add-drop-table \
  > "$RUN_DIR/db.sql"
unset MYSQL_PWD

# Write a small manifest
cat > "$RUN_DIR/manifest.json" <<JSON
{
  "timestamp": "$TIMESTAMP",
  "db_host": "$DB_HOST",
  "db_port": "$DB_PORT",
  "db_name": "$DB_NAME",
  "project_root": "$PROJECT_ROOT"
}
JSON

# Create archive (exclude heavy/build dirs and backups folder itself); also include db.sql at archive root
ARCHIVE_PATH="$BACKUPS_DIR/backup-$TIMESTAMP.tar.gz"

echo "→ Creating archive at $ARCHIVE_PATH ..."
# Use gnu tar style excludes broadly; mac tar supports these patterns sufficiently for our use
 tar -czf "$ARCHIVE_PATH" \
  --exclude='**/node_modules' \
  --exclude='**/.next' \
  --exclude='**/backups' \
  -C "$PROJECT_ROOT" . \
  -C "$RUN_DIR" db.sql manifest.json

echo "✓ Backup complete"
echo "  • DB dump: $RUN_DIR/db.sql"
echo "  • Archive: $ARCHIVE_PATH"
