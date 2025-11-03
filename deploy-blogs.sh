#!/bin/bash

# Deploy Blog Posts to Production Server
# This script uploads blog JSON files and runs insertion scripts on the remote server

set -e  # Exit on any error

# Configuration
SERVER_USER="ubuntu"
SERVER_IP="13.201.23.127"
SERVER_PATH="/home/ubuntu/bihar-opinion-poll"
LOCAL_BACKEND="./backend"

echo "=================================================="
echo "  Blog Deployment Script"
echo "  Deploying blogs to production database"
echo "=================================================="
echo ""

# Check if blog data files exist
if [ ! -f "$LOCAL_BACKEND/data/blog-01-bihar-38-districts.json" ]; then
  echo "❌ Error: blog-01-bihar-38-districts.json not found"
  exit 1
fi

if [ ! -f "$LOCAL_BACKEND/data/blog-02-243-seats.json" ]; then
  echo "❌ Error: blog-02-243-seats.json not found"
  exit 1
fi

echo "✅ Blog data files found locally"
echo ""

# Upload blog data files
echo "📤 Uploading blog data files to server..."
scp -i ~/.ssh/bihar-poll-key.pem \
  "$LOCAL_BACKEND/data/blog-01-bihar-38-districts.json" \
  "$LOCAL_BACKEND/data/blog-02-243-seats.json" \
  "$SERVER_USER@$SERVER_IP:$SERVER_PATH/backend/data/" 2>/dev/null || {
    echo "⚠️  SSH key not found, trying without key..."
    scp "$LOCAL_BACKEND/data/blog-01-bihar-38-districts.json" \
        "$LOCAL_BACKEND/data/blog-02-243-seats.json" \
        "$SERVER_USER@$SERVER_IP:$SERVER_PATH/backend/data/"
  }

echo "✅ Blog data files uploaded"
echo ""

# Upload insertion scripts
echo "📤 Uploading insertion scripts..."
scp -i ~/.ssh/bihar-poll-key.pem \
  "$LOCAL_BACKEND/scripts/insert-blog-01-districts.js" \
  "$LOCAL_BACKEND/scripts/insert-blog-02-seats.js" \
  "$SERVER_USER@$SERVER_IP:$SERVER_PATH/backend/scripts/" 2>/dev/null || {
    scp "$LOCAL_BACKEND/scripts/insert-blog-01-districts.js" \
        "$LOCAL_BACKEND/scripts/insert-blog-02-seats.js" \
        "$SERVER_USER@$SERVER_IP:$SERVER_PATH/backend/scripts/"
  }

echo "✅ Insertion scripts uploaded"
echo ""

# Execute Blog #1 insertion on server
echo "📝 Inserting Blog #1: बिहार में कितने जिले हैं?..."
ssh -i ~/.ssh/bihar-poll-key.pem "$SERVER_USER@$SERVER_IP" << 'ENDSSH' 2>/dev/null || ssh "$SERVER_USER@$SERVER_IP" << 'ENDSSH'
cd /home/ubuntu/bihar-opinion-poll/backend/scripts
node insert-blog-01-districts.js
ENDSSH

echo ""

# Execute Blog #2 insertion on server
echo "📝 Inserting Blog #2: बिहार विधान सभा में कितनी सीट है?..."
ssh -i ~/.ssh/bihar-poll-key.pem "$SERVER_USER@$SERVER_IP" << 'ENDSSH' 2>/dev/null || ssh "$SERVER_USER@$SERVER_IP" << 'ENDSSH'
cd /home/ubuntu/bihar-opinion-poll/backend/scripts
node insert-blog-02-seats.js
ENDSSH

echo ""
echo "=================================================="
echo "  ✅ DEPLOYMENT COMPLETE!"
echo "=================================================="
echo ""
echo "🔗 Blog URLs:"
echo "   Blog #1: https://opinionpoll.co.in/blog/bihar-mein-kitne-jile-hain-2025"
echo "   Blog #2: https://opinionpoll.co.in/blog/bihar-vidhan-sabha-mein-kitni-seat-hai-2025"
echo ""
echo "📊 Next Steps:"
echo "   1. Verify blogs are accessible on website"
echo "   2. Submit URLs to Google Search Console"
echo "   3. Share on social media"
echo "   4. Monitor SEO performance"
echo ""
