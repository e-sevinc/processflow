@echo off
REM ProcessFlow Development Server Startup Script for Windows
REM This script starts both the frontend and backend servers locally

echo 🚀 Starting ProcessFlow Development Servers...
echo ==============================================

REM Check if node_modules exist
if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    call npm install
)

if not exist "backend\node_modules" (
    echo 📦 Installing backend dependencies...
    cd backend
    call npm install
    cd ..
)

REM Initialize Prisma database
echo 🗄️  Setting up Prisma database...
cd backend
if not exist "processflow.db" (
    echo 📊 Creating database and running initial setup...
    call npx prisma db push --accept-data-loss
    call npx prisma generate
) else (
    echo ✅ Database already exists
    call npx prisma generate
)
cd ..

REM Create logs directory
if not exist "logs" mkdir logs

REM Start backend server
echo 🔧 Starting backend server (port 3001)...
cd backend
start "ProcessFlow Backend" cmd /k "npm run dev"
cd ..

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend server
echo 🎨 Starting frontend server (port 3000)...
start "ProcessFlow Frontend" cmd /k "npm run dev"

echo.
echo 🎉 ProcessFlow Development Servers Started!
echo ==============================================
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:3001
echo 🏥 Health Check: http://localhost:3001/api/health
echo.
echo 🛑 To stop servers: Close the opened command windows
echo.

pause
