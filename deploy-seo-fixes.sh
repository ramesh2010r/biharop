#!/bin/bash

# Deploy SEO Improvements to Production Servers
# Date: October 24, 2025

echo "🚀 Deploying SEO Improvements to Production Servers..."
echo "=================================================="

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Server details
SERVER2_IP="43.204.230.163"
SERVER2_USER="ubuntu"
SERVER3_IP="65.2.142.131"
SERVER3_USER="ec2-user"
KEY_PATH="$HOME/Downloads/key2.pem"

echo -e "${BLUE}📦 Step 1: Building Next.js application locally...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Build failed. Please fix errors and try again.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Build successful${NC}\n"

echo -e "${BLUE}📤 Step 2: Deploying to Server 2 ($SERVER2_IP)...${NC}"

# Upload .next folder
echo "  Uploading .next build folder..."
rsync -avz --delete -e "ssh -i $KEY_PATH" .next/ $SERVER2_USER@$SERVER2_IP:~/opinion-poll/.next/

# Upload updated source files
echo "  Uploading updated source files..."
scp -i $KEY_PATH src/app/layout.tsx $SERVER2_USER@$SERVER2_IP:~/opinion-poll/src/app/
scp -i $KEY_PATH src/app/page.tsx $SERVER2_USER@$SERVER2_IP:~/opinion-poll/src/app/
scp -i $KEY_PATH src/components/Footer.tsx $SERVER2_USER@$SERVER2_IP:~/opinion-poll/src/components/

# Upload blog files
echo "  Uploading blog feature files..."
scp -i $KEY_PATH src/app/blog/page.tsx $SERVER2_USER@$SERVER2_IP:~/opinion-poll/src/app/blog/ 2>/dev/null || echo "  Blog directory doesn't exist on server yet"
scp -i $KEY_PATH "src/app/blog/[slug]/page.tsx" $SERVER2_USER@$SERVER2_IP:~/opinion-poll/src/app/blog/[slug]/ 2>/dev/null || echo "  Blog slug directory doesn't exist on server yet"

# Restart services on Server 2
echo "  Restarting PM2 services..."
ssh -i $KEY_PATH $SERVER2_USER@$SERVER2_IP << 'ENDSSH'
cd ~/opinion-poll
pm2 restart frontend
pm2 save
ENDSSH

echo -e "${GREEN}✅ Server 2 deployment complete${NC}\n"

echo -e "${BLUE}📤 Step 3: Deploying to Server 3 ($SERVER3_IP)...${NC}"

# Upload .next folder
echo "  Uploading .next build folder..."
rsync -avz --delete -e "ssh -i $KEY_PATH" .next/ $SERVER3_USER@$SERVER3_IP:~/opinion-poll/.next/

# Upload updated source files
echo "  Uploading updated source files..."
scp -i $KEY_PATH src/app/layout.tsx $SERVER3_USER@$SERVER3_IP:~/opinion-poll/src/app/
scp -i $KEY_PATH src/app/page.tsx $SERVER3_USER@$SERVER3_IP:~/opinion-poll/src/app/
scp -i $KEY_PATH src/components/Footer.tsx $SERVER3_USER@$SERVER3_IP:~/opinion-poll/src/components/

# Upload blog files
echo "  Uploading blog feature files..."
scp -i $KEY_PATH src/app/blog/page.tsx $SERVER3_USER@$SERVER3_IP:~/opinion-poll/src/app/blog/ 2>/dev/null || echo "  Blog directory doesn't exist on server yet"
scp -i $KEY_PATH "src/app/blog/[slug]/page.tsx" $SERVER3_USER@$SERVER3_IP:~/opinion-poll/src/app/blog/[slug]/ 2>/dev/null || echo "  Blog slug directory doesn't exist on server yet"

# Restart services on Server 3
echo "  Restarting PM2 services..."
ssh -i $KEY_PATH $SERVER3_USER@$SERVER3_IP << 'ENDSSH'
cd ~/opinion-poll
pm2 restart frontend
pm2 save
ENDSSH

echo -e "${GREEN}✅ Server 3 deployment complete${NC}\n"

echo -e "${BLUE}🔍 Step 4: Verifying deployment...${NC}"

# Test Server 2
echo "  Testing Server 2..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://$SERVER2_IP:3000)
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "  ${GREEN}✅ Server 2 responding (HTTP $HTTP_CODE)${NC}"
else
    echo -e "  ${YELLOW}⚠️  Server 2 HTTP code: $HTTP_CODE${NC}"
fi

# Test Load Balancer (Server 3)
echo "  Testing Load Balancer..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://opinionpoll.co.in)
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "  ${GREEN}✅ Load Balancer responding (HTTP $HTTP_CODE)${NC}"
else
    echo -e "  ${YELLOW}⚠️  Load Balancer HTTP code: $HTTP_CODE${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo ""
echo "SEO Improvements Deployed:"
echo "  ✅ Favicon added (multiple formats)"
echo "  ✅ Meta description optimized (100 chars)"
echo "  ✅ Page title optimized (53 chars)"
echo "  ✅ Hreflang tags added (hi-IN, en-IN)"
echo "  ✅ Structured data added (Organization, Website)"
echo "  ✅ Social media links added (YouTube, X, LinkedIn, Instagram, Facebook)"
echo "  ✅ Mobile viewport configured"
echo ""
echo "🌐 Visit: https://opinionpoll.co.in"
echo "📊 Test SEO: https://pagespeed.web.dev/"
echo ""
