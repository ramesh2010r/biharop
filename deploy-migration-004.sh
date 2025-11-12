#!/bin/bash

# Deploy Migration 004: Add Multi-State Support
# This script should be run on the production server with database access
# 
# Usage:
#   1. Upload this script to your server: scp deploy-migration-004.sh ubuntu@43.204.230.163:~/
#   2. SSH to server: ssh ubuntu@43.204.230.163
#   3. Run: chmod +x deploy-migration-004.sh && ./deploy-migration-004.sh

set -e  # Exit on any error

echo "======================================================================"
echo "🗄️  MIGRATION 004: Add Multi-State Support"
echo "======================================================================"
echo ""

# Configuration
PROJECT_DIR="$HOME/opinion-poll"
MIGRATION_FILE="backend/migrations/004_add_states_support.sql"
MIGRATION_SCRIPT="backend/scripts/run-migration-004.js"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Navigate to project directory
cd "$PROJECT_DIR" || {
  echo -e "${RED}❌ Project directory not found: $PROJECT_DIR${NC}"
  exit 1
}

echo -e "${GREEN}✓${NC} Working directory: $PROJECT_DIR"
echo ""

# Check if migration files exist
if [ ! -f "$MIGRATION_FILE" ]; then
  echo -e "${RED}❌ Migration SQL file not found: $MIGRATION_FILE${NC}"
  echo "   Pull latest code from GitHub first:"
  echo "   git pull origin main"
  exit 1
fi

if [ ! -f "$MIGRATION_SCRIPT" ]; then
  echo -e "${RED}❌ Migration runner script not found: $MIGRATION_SCRIPT${NC}"
  echo "   Pull latest code from GitHub first:"
  echo "   git pull origin main"
  exit 1
fi

echo -e "${GREEN}✓${NC} Migration files found"
echo ""

# Pull latest code
echo "📥 Pulling latest code from GitHub..."
git pull origin main
echo ""

# Install dependencies if needed
echo "📦 Checking dependencies..."
cd backend
npm install --production
cd ..
echo ""

# Backup reminder
echo -e "${YELLOW}⚠️  IMPORTANT: Database Backup${NC}"
echo "   Before running this migration, ensure you have a recent backup."
echo ""
read -p "   Have you backed up the database? (yes/no): " backup_confirm

if [ "$backup_confirm" != "yes" ]; then
  echo -e "${RED}❌ Migration cancelled. Please backup the database first.${NC}"
  echo ""
  echo "   To create a backup:"
  echo "   mysqldump -h 15.206.160.149 -u admin -p opinion_poll > backup-$(date +%Y%m%d-%H%M%S).sql"
  echo ""
  exit 1
fi

echo ""
echo "🚀 Running migration..."
echo ""

# Run the migration script
node "$MIGRATION_SCRIPT"

MIGRATION_EXIT_CODE=$?

echo ""

if [ $MIGRATION_EXIT_CODE -eq 0 ]; then
  echo -e "${GREEN}======================================================================"
  echo "✅ MIGRATION COMPLETED SUCCESSFULLY"
  echo "======================================================================${NC}"
  echo ""
  echo "Next steps:"
  echo "1. Test Bihar pages to ensure they still work:"
  echo "   - Visit: https://opinionpoll.co.in/vote"
  echo "   - Visit: https://opinionpoll.co.in/results"
  echo "   - Visit: https://opinionpoll.co.in/blog/bihar-mein-kitne-jile-hain-2025"
  echo ""
  echo "2. Verify database changes:"
  echo "   mysql -h 15.206.160.149 -u admin -p opinion_poll"
  echo "   mysql> SELECT * FROM States;"
  echo "   mysql> SHOW COLUMNS FROM Blog_Posts LIKE 'state_id';"
  echo ""
  echo "3. Continue to Day 3-4: URL restructure and redirects"
  echo ""
else
  echo -e "${RED}======================================================================"
  echo "❌ MIGRATION FAILED"
  echo "======================================================================${NC}"
  echo ""
  echo "Check the error messages above for details."
  echo ""
  echo "To rollback (if needed):"
  echo "   See the rollback SQL at the end of: $MIGRATION_FILE"
  echo ""
  exit 1
fi
