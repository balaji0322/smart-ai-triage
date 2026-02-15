# 🚀 AI Smart Patient Triage - Startup Guide

## One-Command Startup

To start the entire project with all services, simply run:

```bash
start.bat
```

This single command will:
1. ✅ Check and start MongoDB service
2. ✅ Start Backend server (FastAPI on port 8000)
3. ✅ Start Frontend server (React/Vite on port 3000)
4. ✅ Open browser automatically to http://localhost:3000

## Available Scripts

### 🟢 start.bat - Start All Services
Starts MongoDB, Backend, and Frontend in one command.

```bash
start.bat
```

**What it does:**
- Checks if MongoDB service is running, starts it if needed
- Launches Backend server in a new window
- Launches Frontend server in a new window
- Waits for services to initialize
- Opens browser automatically
- Provides a status summary
- Press any key to stop all servers

### 🔴 stop.bat - Stop All Services
Stops all running application servers.

```bash
stop.bat
```

**What it does:**
- Stops Frontend server
- Stops Backend server
- Shows MongoDB status (doesn't stop it as it's a Windows service)

### 🔵 status.bat - Check Service Status
Checks the status of all services.

```bash
status.bat
```

**What it shows:**
- MongoDB service status
- Backend server status (with health check)
- Frontend server status
- Port availability (8000, 3000, 27017)
- Quick action commands

## Service Details

### MongoDB (Port 27017)
- **Type**: Windows Service
- **Database**: smartaitriage
- **Connection**: mongodb://localhost:27017/smartaitriage
- **Start**: `net start MongoDB` or automatically via start.bat
- **Stop**: `net stop MongoDB`
- **Status**: `sc query MongoDB`

### Backend (Port 8000)
- **Framework**: FastAPI + Python
- **Location**: ./backend/
- **Start**: `cd backend && python start.py`
- **URL**: http://localhost:8000
- **API Docs**: http://localhost:8000/api/docs
- **Health Check**: http://localhost:8000/health

### Frontend (Port 3000)
- **Framework**: React + Vite + TypeScript
- **Location**: ./frontend/
- **Start**: `npm run dev`
- **URL**: http://localhost:3000

## Manual Startup (Alternative)

If you prefer to start services manually:

### Step 1: Start MongoDB
```bash
net start MongoDB
```

### Step 2: Start Backend
```bash
cd backend
python start.py
```

### Step 3: Start Frontend (in new terminal)
```bash
npm run dev
```

### Step 4: Open Browser
Navigate to http://localhost:3000

## Troubleshooting

### MongoDB Won't Start
```bash
# Check if MongoDB service exists
sc query MongoDB

# If not installed, install MongoDB as a service
# Or run MongoDB manually:
mongod --dbpath C:\data\db
```

### Port Already in Use

**Backend (Port 8000):**
```bash
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**Frontend (Port 3000):**
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <PID> /F
```

### Backend Not Starting
```bash
# Check Python installation
python --version

# Install backend dependencies
cd backend
pip install -r requirements.txt

# Check for errors
python start.py
```

### Frontend Not Starting
```bash
# Check Node.js installation
node --version
npm --version

# Install frontend dependencies
npm install

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Start with verbose logging
npm run dev -- --debug
```

### MongoDB Connection Failed
```bash
# Test MongoDB connection
mongosh

# If connection fails, check MongoDB service
sc query MongoDB

# Check MongoDB logs
# Default location: C:\Program Files\MongoDB\Server\<version>\log\mongod.log
```

## Environment Variables

### Backend (.env)
Located at: `backend/.env`

```env
MONGODB_URL=mongodb://localhost:27017/smartaitriage
MONGODB_DB_NAME=smartaitriage
SECRET_KEY=healthcare-triage-secret-key-change-in-production-2026
GEMINI_API_KEY=your-gemini-api-key-here
ALLOWED_ORIGINS=["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"]
```

### Frontend
No .env file needed for local development. API URL is hardcoded to `http://localhost:8000/api/v1`

## Quick Reference

| Service  | Port  | URL                                    | Command              |
|----------|-------|----------------------------------------|----------------------|
| MongoDB  | 27017 | mongodb://localhost:27017/smartaitriage| net start MongoDB    |
| Backend  | 8000  | http://localhost:8000                  | cd backend && python start.py |
| Frontend | 3000  | http://localhost:3000                  | npm run dev          |
| API Docs | 8000  | http://localhost:8000/api/docs         | -                    |

## Development Workflow

### Daily Startup
```bash
# Start everything
start.bat

# Wait for browser to open
# Start coding!
```

### Daily Shutdown
```bash
# Stop all servers
stop.bat

# Or press any key in the start.bat window
```

### Check Status Anytime
```bash
status.bat
```

## Production Deployment

For production deployment, DO NOT use these scripts. Instead:

1. Use Docker Compose (see `backend/docker-compose.yml`)
2. Set up proper environment variables
3. Use production-grade web servers (Gunicorn, Nginx)
4. Set up MongoDB with authentication
5. Use environment-specific configuration

## Support

If you encounter issues:

1. Run `status.bat` to check service status
2. Check logs in the Backend/Frontend terminal windows
3. Verify MongoDB is running: `mongosh`
4. Check port availability: `netstat -ano | findstr :8000`
5. Review error messages in browser console (F12)

## Files Overview

```
smarttriage-ai/
├── start.bat           # 🟢 Start all services
├── stop.bat            # 🔴 Stop all services
├── status.bat          # 🔵 Check service status
├── STARTUP_GUIDE.md    # 📖 This file
├── backend/
│   ├── start.py        # Backend startup script
│   ├── .env            # Backend configuration
│   └── ...
├── frontend/
│   └── ...
└── ...
```

---

**Quick Start**: Just run `start.bat` and you're ready to go! 🚀
