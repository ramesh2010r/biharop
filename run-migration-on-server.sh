#!/bin/bash

# Manual Migration Script for Server
# Run this directly on the server (43.204.230.163 or 65.2.142.131)

echo "======================================================================"
echo "🗄️  MIGRATION 004: Multi-State Database Support"
echo "======================================================================"
echo ""

# Navigate to project
cd ~/opinion-poll

# Set database environment variables
export DB_HOST="15.206.160.149"
export DB_USER="admin"
export DB_PASSWORD="OpinionPoll@2024"
export DB_NAME="opinion_poll"

echo "Database Configuration:"
echo "  Host: $DB_HOST"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo ""

# Run migration
echo "🚀 Running migration script..."
echo ""

node backend/scripts/run-migration-004.js

EXIT_CODE=$?

echo ""

if [ $EXIT_CODE -eq 0 ]; then
  echo "======================================================================"
  echo "✅ MIGRATION COMPLETED SUCCESSFULLY"
  echo "======================================================================"
  echo ""
  echo "Verification:"
  echo ""
  
  # Verify States table
  echo "1. States Table:"
  mysql -h $DB_HOST -u $DB_USER -p"$DB_PASSWORD" $DB_NAME \
    -e "SELECT id, name, slug, active, total_seats FROM States ORDER BY id;"
  
  echo ""
  echo "2. Sample Blog with state_id:"
  mysql -h $DB_HOST -u $DB_USER -p"$DB_PASSWORD" $DB_NAME \
    -e "SELECT id, LEFT(title_hindi, 40) as title, state_id FROM Blog_Posts LIMIT 3;"
  
  echo ""
  echo "3. Vote distribution by state:"
  mysql -h $DB_HOST -u $DB_USER -p"$DB_PASSWORD" $DB_NAME \
    -e "SELECT state_id, COUNT(*) as votes FROM Votes GROUP BY state_id;"
  
  echo ""
  echo "Next Steps:"
  echo "  1. Test Bihar pages still work"
  echo "  2. Check PM2 logs for errors"
  echo "  3. Proceed to Day 3-4: URL restructure"
  echo ""
  
else
  echo "======================================================================"
  echo "❌ MIGRATION FAILED"
  echo "======================================================================"
  echo ""
  echo "Check the error messages above."
  echo ""
  echo "To rollback (if needed):"
  echo "  Use the backup file created before migration"
  echo ""
  exit 1
fi
