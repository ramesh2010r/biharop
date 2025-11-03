#!/bin/bash

echo "🧪 Testing Blog Feature on Local System"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if MySQL is running
echo "1️⃣ Checking MySQL connection..."
if command -v mysql &> /dev/null; then
    mysql -u root -pTest@123 -e "SELECT 1" &> /dev/null
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ MySQL is running${NC}"
    else
        echo -e "${RED}✗ MySQL authentication failed${NC}"
        echo "Please check your MySQL credentials in backend/.env"
        exit 1
    fi
else
    echo -e "${RED}✗ MySQL not found${NC}"
    echo "Please install MySQL or check your PATH"
    exit 1
fi

# Create database if not exists
echo ""
echo "2️⃣ Creating database..."
mysql -u root -pTest@123 -e "CREATE DATABASE IF NOT EXISTS opinion_poll;" 2>/dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database 'opinion_poll' ready${NC}"
else
    echo -e "${RED}✗ Failed to create database${NC}"
    exit 1
fi

# Run blog schema
echo ""
echo "3️⃣ Creating blog tables..."
mysql -u root -pTest@123 opinion_poll < backend/database/blog_schema.sql 2>/dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Blog tables created${NC}"
    
    # Verify tables
    TABLES=$(mysql -u root -pTest@123 opinion_poll -e "SHOW TABLES LIKE 'Blog%';" 2>/dev/null | grep Blog | wc -l)
    echo "   Created $TABLES blog tables"
else
    echo -e "${RED}✗ Failed to create blog tables${NC}"
    exit 1
fi

# Check if backend is running
echo ""
echo "4️⃣ Checking backend server..."
if lsof -i:5001 &> /dev/null; then
    echo -e "${GREEN}✓ Backend is running on port 5001${NC}"
else
    echo -e "${YELLOW}⚠ Backend not running${NC}"
    echo "   Starting backend server..."
    cd backend
    npm install &> /dev/null
    npm start &> /tmp/backend.log &
    BACKEND_PID=$!
    sleep 3
    
    if lsof -i:5001 &> /dev/null; then
        echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"
    else
        echo -e "${RED}✗ Failed to start backend${NC}"
        echo "Check logs: tail -f /tmp/backend.log"
        exit 1
    fi
    cd ..
fi

# Check if frontend is running
echo ""
echo "5️⃣ Checking frontend server..."
if lsof -i:3000 &> /dev/null; then
    echo -e "${GREEN}✓ Frontend is running on port 3000${NC}"
else
    echo -e "${YELLOW}⚠ Frontend not running${NC}"
    echo "   Starting frontend server..."
    npm install &> /dev/null
    npm run dev &> /tmp/frontend.log &
    FRONTEND_PID=$!
    sleep 5
    
    if lsof -i:3000 &> /dev/null; then
        echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"
    else
        echo -e "${RED}✗ Failed to start frontend${NC}"
        echo "Check logs: tail -f /tmp/frontend.log"
        exit 1
    fi
fi

# Test API endpoints
echo ""
echo "6️⃣ Testing blog API endpoints..."

# Test categories endpoint
echo -n "   GET /api/blog/categories/all ... "
CATEGORIES_RESPONSE=$(curl -s http://localhost:5001/api/blog/categories/all)
if [ $? -eq 0 ] && [ ! -z "$CATEGORIES_RESPONSE" ]; then
    CATEGORIES_COUNT=$(echo $CATEGORIES_RESPONSE | grep -o '"id":' | wc -l)
    echo -e "${GREEN}✓ ($CATEGORIES_COUNT categories)${NC}"
else
    echo -e "${RED}✗${NC}"
fi

# Test blog listing endpoint
echo -n "   GET /api/blog ... "
BLOG_RESPONSE=$(curl -s http://localhost:5001/api/blog)
if [ $? -eq 0 ] && [ ! -z "$BLOG_RESPONSE" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
fi

# Test frontend pages
echo ""
echo "7️⃣ Testing frontend pages..."

# Test blog listing page
echo -n "   GET /blog ... "
BLOG_PAGE=$(curl -s http://localhost:3000/blog)
if [ $? -eq 0 ] && echo "$BLOG_PAGE" | grep -q "बिहार चुनाव ब्लॉग"; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
fi

# Summary
echo ""
echo "========================================"
echo -e "${GREEN}✅ Blog feature setup complete!${NC}"
echo ""
echo "📝 Next steps:"
echo "   1. Visit http://localhost:3000/blog"
echo "   2. Login to admin: http://localhost:3000/admin/login"
echo "   3. Create a test blog post"
echo ""
echo "🔧 Useful commands:"
echo "   - View backend logs: tail -f /tmp/backend.log"
echo "   - View frontend logs: tail -f /tmp/frontend.log"
echo "   - Stop servers: killall node"
echo ""
echo "📊 Database info:"
echo "   - Database: opinion_poll"
echo "   - Tables: Blog_Posts, Blog_Categories, Blog_Comments"
echo "   - Default categories: 5"
echo ""
