#!/bin/bash

echo "🚀 Deploying Blog Feature to Production..."
echo "=================================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Server details
SERVER1_IP="15.206.160.149"
SERVER1_USER="ubuntu"
SERVER1_KEY="$HOME/Downloads/opinionweb.pem"

SERVER2_IP="43.204.230.163"
SERVER2_USER="ubuntu"
SERVER2_KEY="$HOME/Downloads/key2.pem"

echo ""
echo "📊 Step 1: Setting up Blog Database Schema..."
echo "  Uploading blog_schema.sql to database server..."
scp -i "$SERVER1_KEY" backend/database/blog_schema.sql "$SERVER1_USER@$SERVER1_IP":~/blog_schema.sql

echo "  Creating blog tables..."
ssh -i "$SERVER1_KEY" "$SERVER1_USER@$SERVER1_IP" << 'ENDSSH'
mysql -u root -p$(cat /root/.mysql_password 2>/dev/null || echo "your_password") bihar_opinion_poll < ~/blog_schema.sql
if [ $? -eq 0 ]; then
    echo "✅ Blog tables created successfully"
else
    echo "⚠️  Blog tables may already exist or error occurred"
fi
ENDSSH

echo ""
echo "📤 Step 2: Deploying Blog Backend to Server 2..."
echo "  Uploading blog route..."
scp -i "$SERVER2_KEY" backend/routes/blog.js "$SERVER2_USER@$SERVER2_IP":~/bihar-opinion-poll/backend/routes/

echo "  Updating server.js to include blog routes..."
ssh -i "$SERVER2_KEY" "$SERVER2_USER@$SERVER2_IP" << 'ENDSSH'
cd ~/bihar-opinion-poll/backend
# Check if blog route is already added
if ! grep -q "app.use('/api/blog" server.js; then
    # Add blog route before the catch-all route
    sed -i "/app.use('\/api\/upload/a app.use('/api/blog', require('./routes/blog'));" server.js
    echo "✅ Blog route added to server.js"
else
    echo "✅ Blog route already exists in server.js"
fi
ENDSSH

echo ""
echo "🔄 Step 3: Restarting Backend Server..."
ssh -i "$SERVER2_KEY" "$SERVER2_USER@$SERVER2_IP" 'pm2 restart backend-server2'

echo ""
echo "🎉 Blog Feature Deployment Complete!"
echo ""
echo "✅ Blog database tables created"
echo "✅ Blog API routes deployed"
echo "✅ Backend server restarted"
echo ""
echo "📝 Next Steps:"
echo "  1. Access admin dashboard: https://opinionpoll.co.in/admin/dashboard"
echo "  2. Go to 'Blog Management' section"
echo "  3. Create your first blog post"
echo "  4. View blog at: https://opinionpoll.co.in/blog"
echo ""
