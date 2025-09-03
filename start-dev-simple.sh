#!/bin/bash

# ProcessFlow Simple Development Server Startup Script
# This script starts both servers with better error handling and fallbacks

set -e

echo "🚀 Starting ProcessFlow Development Servers (Simple Mode)..."
echo "=========================================================="

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

# Check if required ports are available
echo -e "${BLUE}🔍 Checking port availability...${NC}"
check_port 3001  # Backend port
check_port 3000  # Frontend port

# Install frontend dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
    npm install
fi

# Try to install backend dependencies
echo -e "${YELLOW}📦 Checking backend dependencies...${NC}"
if [ ! -d "backend/node_modules" ]; then
    echo -e "${BLUE}⚠️  Installing backend dependencies...${NC}"
    cd backend
    
    # Try different installation methods
    if npm install 2>/dev/null; then
        echo -e "${GREEN}✅ Backend dependencies installed successfully${NC}"
    else
        echo -e "${RED}❌ Backend dependencies installation failed${NC}"
        echo -e "${YELLOW}💡 This is likely due to Prisma/SQLite dependencies requiring C++20${NC}"
        echo -e "${YELLOW}💡 Solutions:${NC}"
        echo -e "${YELLOW}   1. Use Node.js 18: nvm install 18 && nvm use 18${NC}"
        echo -e "${YELLOW}   2. Update Xcode: xcode-select --install${NC}"
        echo -e "${YELLOW}   3. Use Docker: docker-compose up${NC}"
        echo ""
        echo -e "${BLUE}🔄 Trying to start frontend only...${NC}"
        cd ..
        
        # Start only frontend
        echo -e "${BLUE}🎨 Starting frontend server (port 3000)...${NC}"
        npm run dev &
        FRONTEND_PID=$!
        
        echo ""
        echo -e "${GREEN}🎉 Frontend server started!${NC}"
        echo "=============================================="
        echo -e "${GREEN}📱 Frontend:${NC} http://localhost:3000"
        echo -e "${RED}⚠️  Backend:${NC} Not available (dependency issue)"
        echo ""
        echo -e "${YELLOW}🛑 To stop: kill $FRONTEND_PID${NC}"
        echo -e "${YELLOW}💡 To fix backend: See solutions above${NC}"
        
        # Keep script running
        wait $FRONTEND_PID
        exit 0
    fi
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
echo -e "${BLUE}📊 Showing live logs (Ctrl+C to stop):${NC}"
echo "=============================================="
tail -f logs/backend.log logs/frontend.log
