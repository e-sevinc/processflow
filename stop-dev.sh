#!/bin/bash

# ProcessFlow Development Server Stop Script
# This script stops both the frontend and backend servers

echo "🛑 Stopping ProcessFlow Development Servers..."
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to stop server by PID
stop_server() {
    local pid_file=$1
    local server_name=$2
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if kill -0 "$pid" 2>/dev/null; then
            echo -e "${BLUE}🛑 Stopping $server_name (PID: $pid)...${NC}"
            kill "$pid"
            sleep 2
            if kill -0 "$pid" 2>/dev/null; then
                echo -e "${YELLOW}⚠️  Force killing $server_name...${NC}"
                kill -9 "$pid"
            fi
            echo -e "${GREEN}✅ $server_name stopped${NC}"
        else
            echo -e "${YELLOW}⚠️  $server_name was not running${NC}"
        fi
        rm -f "$pid_file"
    else
        echo -e "${YELLOW}⚠️  No PID file found for $server_name${NC}"
    fi
}

# Stop servers using PID files
stop_server "logs/backend.pid" "Backend Server"
stop_server "logs/frontend.pid" "Frontend Server"

# Also try to kill any remaining processes on the ports
echo -e "${BLUE}🔍 Checking for remaining processes on ports 3001 and 3000...${NC}"

# Kill processes on port 3001 (backend)
BACKEND_PIDS=$(lsof -ti:3001 2>/dev/null || true)
if [ ! -z "$BACKEND_PIDS" ]; then
    echo -e "${YELLOW}⚠️  Found processes on port 3001, killing them...${NC}"
    echo "$BACKEND_PIDS" | xargs kill -9 2>/dev/null || true
fi

# Kill processes on port 3000 (frontend)
FRONTEND_PIDS=$(lsof -ti:3000 2>/dev/null || true)
if [ ! -z "$FRONTEND_PIDS" ]; then
    echo -e "${YELLOW}⚠️  Found processes on port 3000, killing them...${NC}"
    echo "$FRONTEND_PIDS" | xargs kill -9 2>/dev/null || true
fi

echo ""
echo -e "${GREEN}🎉 All ProcessFlow servers have been stopped!${NC}"
echo "=============================================="
