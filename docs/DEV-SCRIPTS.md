# ProcessFlow Development Scripts

This document describes the development scripts available for running the ProcessFlow application locally.

## 🚀 Quick Start

### Option 1: Using npm scripts (Recommended)
```bash
# Start both frontend and backend servers
npm run start:dev

# Start with fallback (frontend only if backend fails)
npm run start:dev:simple

# Stop both servers
npm run stop:dev
```

### Option 2: Using shell scripts directly
```bash
# Start both servers
./start-dev.sh

# Start with fallback (frontend only if backend fails)
./start-dev-simple.sh

# Stop both servers
./stop-dev.sh
```

### Option 3: Windows users
```bash
# Start both servers (Windows)
npm run start:dev:win
# or
start-dev.bat
```

## 📋 What the scripts do

### `start-dev.sh` / `start-dev.bat`
- ✅ Checks if required ports (3001, 3000) are available
- 📦 Installs dependencies if `node_modules` folders don't exist
- 🗄️ Sets up Prisma database (creates schema and generates client)
- 🔧 Starts backend server on port 3001
- 🎨 Starts frontend server on port 3000
- ⏳ Waits for both servers to be ready
- 📊 Shows live logs from both servers
- 🛑 Handles graceful shutdown with Ctrl+C

### `stop-dev.sh`
- 🛑 Stops both servers using saved process IDs
- 🔍 Kills any remaining processes on ports 3001 and 3000
- 🧹 Cleans up PID files

## 🌐 Server URLs

Once started, the application will be available at:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

## 📁 Logs

Logs are saved in the `logs/` directory:
- `logs/frontend.log` - Frontend server logs
- `logs/backend.log` - Backend server logs
- `logs/frontend.pid` - Frontend process ID
- `logs/backend.pid` - Backend process ID

## 🔧 Manual Server Management

If you prefer to run servers manually:

### Backend only:
```bash
cd backend
npm run dev
```

### Frontend only:
```bash
npm run dev
```

## 🗄️ Prisma Database Management

The project now uses Prisma ORM. Here are some useful commands:

### Database Operations:
```bash
cd backend

# Generate Prisma client
npm run db:generate

# Push schema changes to database
npm run db:push

# Create and apply migrations
npm run db:migrate

# Open Prisma Studio (database GUI)
npm run db:studio

# Reset database (⚠️ deletes all data)
npx prisma db push --accept-data-loss
```

### First-time Setup:
```bash
cd backend
npm install
npx prisma db push
npx prisma generate
npm run dev
```

## 🐛 Troubleshooting

### Port already in use
If you get a "port already in use" error:
```bash
# Kill processes on specific ports
lsof -ti:3001 | xargs kill -9  # Backend port
lsof -ti:3000 | xargs kill -9  # Frontend port
```

### Dependencies not installed
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Prisma/Database Issues
```bash
cd backend

# Regenerate Prisma client
npx prisma generate

# Reset database schema
npx prisma db push --accept-data-loss

# Check database status
npx prisma db pull

# Open database in Prisma Studio
npx prisma studio
```

### C++ Compilation Issues (Prisma/SQLite)
If you get C++ compilation errors during `npm install`:
```bash
# Update Xcode Command Line Tools (macOS)
xcode-select --install

# Use Node.js 18 instead of 24
nvm install 18
nvm use 18

# Or force install
npm install --force
```

### Scripts not executable (Linux/Mac)
```bash
chmod +x start-dev.sh stop-dev.sh
```

## 📝 Notes

- The scripts automatically handle dependency installation
- Both servers run in development mode with hot reload
- The start script will show live logs from both servers
- Use Ctrl+C to stop the start script and both servers
- The stop script can be used to clean up any remaining processes
