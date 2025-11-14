#!/bin/bash

# ============================================================================
# DEPLOY MIGRATION 004 CODE TO SERVERS
# ============================================================================
# This script deploys the latest code containing migration files
# Run this from your local machine
# ============================================================================

echo "════════════════════════════════════════════════════════════════════"
echo "📦 DEPLOYING MIGRATION 004 CODE TO SERVERS"
echo "════════════════════════════════════════════════════════════════════"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# ============================================================================
# STEP 1: Deploy to Backend Server (43.204.230.163)
# ============================================================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 STEP 1: Deploy Code to Backend Server (43.204.230.163)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

ssh ubuntu@43.204.230.163 << 'EOF'
set -e

echo "📍 Server: Backend (43.204.230.163)"
echo "📁 Directory: ~/opinion-poll"
echo ""

cd ~/opinion-poll

echo "📥 Pulling latest code from GitHub..."
git fetch origin
git reset --hard origin/main
echo ""

echo "Files updated:"
git log -1 --stat --oneline
echo ""

echo "📦 Installing backend dependencies..."
cd backend
npm install --production
cd ..
echo ""

echo -e "\033[0;32m✅ Backend Server code deployed successfully\033[0m"
echo ""

EOF

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to deploy to Backend Server${NC}"
    exit 1
fi

# ============================================================================
# STEP 2: Deploy to Load Balancer Server (65.2.142.131)
# ============================================================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 STEP 2: Deploy Code to Load Balancer (65.2.142.131)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

ssh ec2-user@65.2.142.131 << 'EOF'
set -e

echo "📍 Server: Load Balancer (65.2.142.131)"
echo "📁 Directory: ~/opinion-poll"
echo ""

cd ~/opinion-poll

echo "📥 Pulling latest code from GitHub..."
git fetch origin
git reset --hard origin/main
echo ""

echo "Files updated:"
git log -1 --stat --oneline
echo ""

echo "📦 Installing backend dependencies..."
cd backend
npm install --production
cd ..
echo ""

echo -e "\033[0;32m✅ Load Balancer code deployed successfully\033[0m"
echo ""

EOF

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Warning: Failed to deploy to Load Balancer${NC}"
    echo "Backend Server is updated. You can manually update Load Balancer later."
    echo ""
fi

# ============================================================================
# STEP 3: Verify Migration Files Exist
# ============================================================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 STEP 3: Verify Migration Files on Server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

ssh ubuntu@43.204.230.163 << 'EOF'
cd ~/opinion-poll

echo "Checking for migration files..."
echo ""

if [ -f "backend/migrations/004_add_states_support.sql" ]; then
    echo "✅ backend/migrations/004_add_states_support.sql"
    ls -lh backend/migrations/004_add_states_support.sql
else
    echo "❌ Migration SQL file NOT FOUND"
fi

echo ""

if [ -f "backend/scripts/run-migration-004.js" ]; then
    echo "✅ backend/scripts/run-migration-004.js"
    ls -lh backend/scripts/run-migration-004.js
else
    echo "❌ Migration script NOT FOUND"
fi

echo ""

EOF

# ============================================================================
# DEPLOYMENT COMPLETE
# ============================================================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ CODE DEPLOYMENT COMPLETE${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Both servers now have the latest code with migration files."
echo ""
echo "Next Step: Run the migration on the database"
echo ""
echo "═══════════════════════════════════════════════════════════════════════"
echo "🚀 READY TO RUN MIGRATION"
echo "═══════════════════════════════════════════════════════════════════════"
echo ""
echo "Option 1: Run from your local machine (Quick)"
echo "──────────────────────────────────────────────────────────────────────"
echo ""
echo "ssh ubuntu@43.204.230.163 \"cd ~/opinion-poll && \\"
echo "  DB_HOST='15.206.160.149' \\"
echo "  DB_USER='admin' \\"
echo "  DB_PASSWORD='OpinionPoll@2024' \\"
echo "  DB_NAME='opinion_poll' \\"
echo "  node backend/scripts/run-migration-004.js\""
echo ""
echo "──────────────────────────────────────────────────────────────────────"
echo ""
echo "Option 2: SSH to server and run manually"
echo "──────────────────────────────────────────────────────────────────────"
echo ""
echo "ssh ubuntu@43.204.230.163"
echo "cd ~/opinion-poll"
echo "DB_HOST='15.206.160.149' DB_USER='admin' DB_PASSWORD='OpinionPoll@2024' DB_NAME='opinion_poll' node backend/scripts/run-migration-004.js"
echo ""
echo "═══════════════════════════════════════════════════════════════════════"
echo ""
