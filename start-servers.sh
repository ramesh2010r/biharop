#!/bin/bash

# Bihar Election Opinion Poll - Server Startup Script

echo "================================================"
echo "Bihar Election Opinion Poll"
echo "Starting Development Servers..."
echo "================================================"

# Kill any existing processes on ports 3000, 3001, and 5001
echo "Cleaning up old processes..."
lsof -ti:3000,3001,5001 | xargs kill -9 2>/dev/null
sleep 1

# Start backend server
echo ""
echo "Starting Backend API on port 5001..."
cd backend && npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend server
echo ""
echo "Starting Frontend on port 3000..."
cd ..
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 3

echo ""
echo "================================================"
echo "✅ Servers Started Successfully!"
echo "================================================"
echo ""
echo "🌐 Frontend:        http://localhost:3000"
echo "🔌 Backend API:     http://localhost:5001"
echo "👤 Admin Panel:     http://localhost:3000/admin"
echo "🗳️  Voting Page:     http://localhost:3000/vote"
echo "📊 Results:         http://localhost:3000/results"
echo ""
echo "================================================"
echo "Press Ctrl+C to stop all servers"
echo "================================================"
echo ""

# Wait for user to press Ctrl+C
wait
