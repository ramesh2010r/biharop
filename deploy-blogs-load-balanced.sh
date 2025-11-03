#!/bin/bash

# Deploy 3 Blog Posts to Load Balanced Production Environment
# Date: November 4, 2025
# Blogs: 13,000+ words total, SEO optimized

set -e

echo "🚀 Deploying Blog Posts to Load Balanced Servers..."
echo "=================================================="

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Server configuration
BACKEND_SERVER="43.204.230.163"
BACKEND_USER="ubuntu"
LOAD_BALANCER="65.2.142.131"
LB_USER="ec2-user"
KEY_PATH="$HOME/Downloads/key2.pem"
PROJECT_DIR="~/opinion-poll"

# Check if SSH key exists
if [ ! -f "$KEY_PATH" ]; then
    echo -e "${RED}❌ SSH key not found: $KEY_PATH${NC}"
    exit 1
fi

echo -e "${GREEN}✅ SSH key found${NC}\n"

# ============================================
# STEP 1: Deploy Code to Backend Server
# ============================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📦 Step 1: Deploying Code to Backend Server${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

ssh -i "$KEY_PATH" $BACKEND_USER@$BACKEND_SERVER << 'ENDSSH'
cd ~/opinion-poll

echo "📥 Pulling latest code from GitHub..."
git pull origin main

if [ $? -ne 0 ]; then
    echo "⚠️  Git pull failed. Trying to resolve..."
    git reset --hard origin/main
    git pull origin main
fi

echo "✅ Code updated"

# Check if blog data files exist
echo ""
echo "📋 Verifying blog files..."
if [ -f "backend/data/blog-01-bihar-38-districts-converted.json" ] && \
   [ -f "backend/data/blog-02-243-seats-converted.json" ] && \
   [ -f "backend/data/blog-03-bihar-cm-converted.json" ]; then
    echo "✅ All 3 blog JSON files found (converted schema)"
else
    echo "❌ Blog files missing!"
    exit 1
fi

if [ -f "backend/scripts/insert-blog-01-districts.js" ] && \
   [ -f "backend/scripts/insert-blog-02-seats.js" ] && \
   [ -f "backend/scripts/insert-blog-03-cm.js" ]; then
    echo "✅ All 3 insertion scripts found"
else
    echo "❌ Insertion scripts missing!"
    exit 1
fi

# Install dependencies if needed
echo ""
echo "📦 Installing dependencies..."
cd backend
if [ ! -d "node_modules/mysql2" ]; then
    npm install mysql2
    echo "✅ mysql2 installed"
else
    echo "✅ Dependencies already installed"
fi
cd ..

echo ""
echo "✅ Backend server code deployment complete"
ENDSSH

echo -e "${GREEN}✅ Backend Server Updated${NC}\n"

# ============================================
# STEP 2: Insert Blogs into Database (ONCE)
# ============================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}💾 Step 2: Inserting Blogs into Database${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo "📝 Inserting Blog #1: बिहार में कितने जिले हैं?"
ssh -i "$KEY_PATH" $BACKEND_USER@$BACKEND_SERVER << 'ENDSSH'
cd ~/opinion-poll/backend/scripts
node insert-blog-01-districts.js
ENDSSH

echo ""
echo "📝 Inserting Blog #2: बिहार विधान सभा में कितनी सीट है?"
ssh -i "$KEY_PATH" $BACKEND_USER@$BACKEND_SERVER << 'ENDSSH'
cd ~/opinion-poll/backend/scripts
node insert-blog-02-seats.js
ENDSSH

echo ""
echo "📝 Inserting Blog #3: बिहार के मुख्यमंत्री कौन हैं?"
ssh -i "$KEY_PATH" $BACKEND_USER@$BACKEND_SERVER << 'ENDSSH'
cd ~/opinion-poll/backend/scripts
node insert-blog-03-cm.js
ENDSSH

echo ""
echo -e "${GREEN}✅ All blogs inserted into database${NC}\n"

# ============================================
# STEP 3: Verify Database Insertion
# ============================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📊 Step 3: Verifying Database${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

ssh -i "$KEY_PATH" $BACKEND_USER@$BACKEND_SERVER << 'ENDSSH'
mysql -u opinion_poll_user -p'BiharPoll2025Secure' bihar_opinion_poll << 'EOSQL'
SELECT 
  post_id AS ID,
  LEFT(title, 60) AS Title,
  slug AS Slug,
  status AS Status,
  DATE_FORMAT(published_at, '%Y-%m-%d') AS Published
FROM Blog_Posts
WHERE slug IN (
  'bihar-mein-kitne-jile-hain-2025',
  'bihar-vidhan-sabha-mein-kitni-seat-hai-2025',
  'bihar-ke-mukhyamantri-kaun-hain-2025'
)
ORDER BY post_id DESC;
EOSQL
ENDSSH

echo -e "${GREEN}✅ Database verification complete${NC}\n"

# ============================================
# STEP 4: Deploy to Load Balancer
# ============================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}⚖️  Step 4: Deploying to Load Balancer${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

ssh -i "$KEY_PATH" $LB_USER@$LOAD_BALANCER << 'ENDSSH'
cd ~/opinion-poll

echo "📥 Pulling latest code from GitHub..."
git pull origin main

if [ $? -ne 0 ]; then
    echo "⚠️  Git pull failed. Trying to resolve..."
    git reset --hard origin/main
    git pull origin main
fi

echo "✅ Load balancer code updated"
ENDSSH

echo -e "${GREEN}✅ Load Balancer Updated${NC}\n"

# ============================================
# STEP 5: Restart Services
# ============================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🔄 Step 5: Restarting Services${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo "🔄 Restarting Backend Server..."
ssh -i "$KEY_PATH" $BACKEND_USER@$BACKEND_SERVER << 'ENDSSH'
cd ~/opinion-poll
pm2 restart all
sleep 3
pm2 status
ENDSSH

echo ""
echo "🔄 Restarting Load Balancer..."
ssh -i "$KEY_PATH" $LB_USER@$LOAD_BALANCER << 'ENDSSH'
cd ~/opinion-poll
pm2 restart all
sleep 3
pm2 status
ENDSSH

echo -e "${GREEN}✅ All services restarted${NC}\n"

# ============================================
# STEP 6: Test Blog URLs
# ============================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🧪 Step 6: Testing Blog URLs${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

sleep 5  # Give servers time to restart

echo "Testing Blog #1..."
HTTP_CODE1=$(curl -s -o /dev/null -w "%{http_code}" "https://opinionpoll.co.in/blog/bihar-mein-kitne-jile-hain-2025")
if [ "$HTTP_CODE1" = "200" ]; then
    echo -e "  ${GREEN}✅ Blog #1: HTTP $HTTP_CODE1 (Success)${NC}"
else
    echo -e "  ${RED}❌ Blog #1: HTTP $HTTP_CODE1 (Failed)${NC}"
fi

echo "Testing Blog #2..."
HTTP_CODE2=$(curl -s -o /dev/null -w "%{http_code}" "https://opinionpoll.co.in/blog/bihar-vidhan-sabha-mein-kitni-seat-hai-2025")
if [ "$HTTP_CODE2" = "200" ]; then
    echo -e "  ${GREEN}✅ Blog #2: HTTP $HTTP_CODE2 (Success)${NC}"
else
    echo -e "  ${RED}❌ Blog #2: HTTP $HTTP_CODE2 (Failed)${NC}"
fi

echo "Testing Blog #3..."
HTTP_CODE3=$(curl -s -o /dev/null -w "%{http_code}" "https://opinionpoll.co.in/blog/bihar-ke-mukhyamantri-kaun-hain-2025")
if [ "$HTTP_CODE3" = "200" ]; then
    echo -e "  ${GREEN}✅ Blog #3: HTTP $HTTP_CODE3 (Success)${NC}"
else
    echo -e "  ${RED}❌ Blog #3: HTTP $HTTP_CODE3 (Failed)${NC}"
fi

echo ""

# ============================================
# FINAL SUMMARY
# ============================================
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 DEPLOYMENT COMPLETE!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "📊 Summary:"
echo "  • 3 blogs deployed (13,000+ words)"
echo "  • Backend server updated: $BACKEND_SERVER"
echo "  • Load balancer updated: $LOAD_BALANCER"
echo "  • All services restarted"
echo ""
echo "🔗 Blog URLs:"
echo "  1. https://opinionpoll.co.in/blog/bihar-mein-kitne-jile-hain-2025"
echo "  2. https://opinionpoll.co.in/blog/bihar-vidhan-sabha-mein-kitni-seat-hai-2025"
echo "  3. https://opinionpoll.co.in/blog/bihar-ke-mukhyamantri-kaun-hain-2025"
echo ""
echo "📋 Next Steps:"
echo "  1. Clear browser cache and test URLs in incognito mode"
echo "  2. Submit URLs to Google Search Console for indexing"
echo "  3. Share on social media (WhatsApp, Facebook, Twitter)"
echo "  4. Create featured images (see BLOG_VISUAL_ASSETS_GUIDE.md)"
echo ""
echo "⚠️  If blogs still show 404:"
echo "  - Wait 2-3 minutes for full propagation"
echo "  - Clear CDN cache if using Cloudflare/CloudFront"
echo "  - Check pm2 logs: ssh and run 'pm2 logs'"
echo ""
echo -e "${GREEN}✨ Deployment successful!${NC}"
