#!/bin/bash

# Quick Deployment Commands for Migration 004
# Copy-paste these commands on your production server

echo "======================================================================"
echo "🚀 QUICK DEPLOYMENT: Migration 004"
echo "======================================================================"
echo ""
echo "Run these commands on your production server (43.204.230.163)"
echo ""

cat << 'EOF'

# ============================================================
# STEP 1: SSH to Production Server
# ============================================================

ssh ubuntu@43.204.230.163


# ============================================================
# STEP 2: Navigate to Project and Pull Latest Code
# ============================================================

cd ~/opinion-poll
git pull origin main


# ============================================================
# STEP 3: BACKUP DATABASE (CRITICAL!)
# ============================================================

# Create timestamped backup
mysqldump -h 15.206.160.149 \
  -u admin \
  -p'OpinionPoll@2024' \
  opinion_poll > backup-before-migration-004-$(date +%Y%m%d-%H%M%S).sql

# Verify backup was created
ls -lh backup-*.sql | tail -1

# Expected: You should see a .sql file with today's timestamp


# ============================================================
# STEP 4: Run Migration Script
# ============================================================

node backend/scripts/run-migration-004.js


# ============================================================
# EXPECTED OUTPUT:
# ============================================================
# 
# 🚀 Starting Migration: Add Multi-State Support
# 
# ✓ Transaction started
# ✓ Creating States table...
# ✓ Seeding Bihar, Maharashtra, Jharkhand...
# ✓ Adding state_id columns...
# ✓ Backfilling existing data...
# ✓ Creating indexes...
# ✓ Transaction committed
# 
# ✅ MIGRATION COMPLETED SUCCESSFULLY
# 


# ============================================================
# STEP 5: Verify Migration (Run in MySQL)
# ============================================================

mysql -h 15.206.160.149 -u admin -p'OpinionPoll@2024' opinion_poll

# Once connected to MySQL, run:

SELECT * FROM States;

# Expected output:
# +----+-------------+-------------+--------+
# | id | name        | slug        | active |
# +----+-------------+-------------+--------+
# |  1 | Bihar       | bihar       |      1 |
# |  2 | Maharashtra | maharashtra |      0 |
# |  3 | Jharkhand   | jharkhand   |      0 |
# +----+-------------+-------------+--------+

SHOW COLUMNS FROM Blog_Posts LIKE 'state_id';

# Expected: Shows state_id column with default value 1

SELECT state_id, COUNT(*) FROM Votes GROUP BY state_id;

# Expected: All votes have state_id=1 (Bihar)

exit;  # Exit MySQL


# ============================================================
# STEP 6: Test Bihar Pages
# ============================================================

# From your local machine, visit these URLs:

# ✅ https://opinionpoll.co.in/vote
# ✅ https://opinionpoll.co.in/results
# ✅ https://opinionpoll.co.in/blog/bihar-mein-kitne-jile-hain-2025

# All should work exactly as before!


# ============================================================
# STEP 7: Check Server Logs for Errors
# ============================================================

pm2 logs backend-server --lines 50

# Look for any errors or warnings


# ============================================================
# IF EVERYTHING WORKS:
# ============================================================

echo "✅ Migration successful!"
echo "Next: Proceed to Day 3-4 (URL restructure and redirects)"


# ============================================================
# IF SOMETHING FAILS - ROLLBACK:
# ============================================================

# Restore from backup:
mysql -h 15.206.160.149 \
  -u admin \
  -p'OpinionPoll@2024' \
  opinion_poll < backup-before-migration-004-[your-timestamp].sql

# Replace [your-timestamp] with actual backup filename

EOF
