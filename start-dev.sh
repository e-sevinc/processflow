#!/bin/bash

# ProcessFlow Development Server Startup Script
# This script starts both the frontend and backend servers locally

set -e  # Exit on any error

echo "🚀 Starting ProcessFlow Development Servers..."
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${RED}❌ Port $port is already in use${NC}"
        echo -e "${YELLOW}Please stop the service using port $port and try again${NC}"
        exit 1
    fi
}

# Function to wait for server to be ready
wait_for_server() {
    local url=$1
    local name=$2
    local max_attempts=30
    local attempt=1
    
    echo -e "${BLUE}⏳ Waiting for $name to be ready...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ $name is ready!${NC}"
            return 0
        fi
        sleep 1
        attempt=$((attempt + 1))
    done
    
    echo -e "${RED}❌ $name failed to start within 30 seconds${NC}"
    return 1
}

# Check if required ports are available
echo -e "${BLUE}🔍 Checking port availability...${NC}"
check_port 3001  # Backend port
check_port 3000  # Frontend port

# Check if node_modules exist
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
    npm install
fi

if [ ! -d "backend/node_modules" ]; then
    echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
    cd backend
    echo -e "${BLUE}⚠️  Note: Prisma and SQLite dependencies may require C++20. If installation fails, try:${NC}"
    echo -e "${BLUE}   1. Update Xcode Command Line Tools: xcode-select --install${NC}"
    echo -e "${BLUE}   2. Or use Node.js 18 instead of 24${NC}"
    echo ""
    npm install || {
        echo -e "${RED}❌ Backend dependencies installation failed${NC}"
        echo -e "${YELLOW}💡 Try running: npm install --force${NC}"
        echo -e "${YELLOW}💡 Or downgrade to Node.js 18: nvm use 18${NC}"
        exit 1
    }
    cd ..
fi

# Initialize Prisma database
echo -e "${BLUE}🗄️  Setting up Prisma database...${NC}"
cd backend
if [ ! -f "processflow.db" ]; then
    echo -e "${YELLOW}📊 Creating database and running initial setup...${NC}"
    npx prisma db push --accept-data-loss
    npx prisma generate
else
    echo -e "${GREEN}✅ Database already exists${NC}"
    npx prisma generate
fi
cd ..

# Create log directory
mkdir -p logs

# Start backend server in background
echo -e "${BLUE}🔧 Starting backend server (port 3001)...${NC}"
cd backend
npm run dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Start frontend server in background
echo -e "${BLUE}🎨 Starting frontend server (port 3000)...${NC}"
npm run dev > logs/frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait for servers to be ready
wait_for_server "http://localhost:3001/api/health" "Backend API"
wait_for_server "http://localhost:3000" "Frontend"

# Save PIDs for cleanup
echo $BACKEND_PID > logs/backend.pid
echo $FRONTEND_PID > logs/frontend.pid

echo ""
echo -e "${GREEN}🎉 ProcessFlow Development Servers Started Successfully!${NC}"
echo "=============================================="
echo -e "${GREEN}📱 Frontend:${NC} http://localhost:3000"
echo -e "${GREEN}🔧 Backend API:${NC} http://localhost:3001"
echo -e "${GREEN}🏥 Health Check:${NC} http://localhost:3001/api/health"
echo ""
echo -e "${YELLOW}📋 Logs:${NC}"
echo -e "   Frontend: ${BLUE}logs/frontend.log${NC}"
echo -e "   Backend:  ${BLUE}logs/backend.log${NC}"
echo ""
echo -e "${YELLOW}🛑 To stop servers:${NC}"
echo -e "   Run: ${BLUE}./stop-dev.sh${NC}"
echo -e "   Or:  ${BLUE}kill $BACKEND_PID $FRONTEND_PID${NC}"
echo ""

# Keep script running and show logs
echo -e "${BLUE}📊 Showing live logs (Ctrl+C to stop):${NC}"
echo "=============================================="

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Stopping servers...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    rm -f logs/backend.pid logs/frontend.pid
    echo -e "${GREEN}✅ Servers stopped${NC}"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Show live logs
tail -f logs/backend.log logs/frontend.log
