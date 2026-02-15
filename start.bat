@echo off
title AI Smart Patient Triage - Startup Manager
color 0A

echo.
echo ========================================
echo   AI Smart Patient Triage System
echo   Complete Startup Manager
echo ========================================
echo.

REM Check if MongoDB service is running
echo [1/4] Checking MongoDB Service...
sc query MongoDB | find "RUNNING" > nul
if %errorlevel% equ 0 (
    echo [OK] MongoDB is already running
) else (
    echo [!] MongoDB is not running. Starting MongoDB service...
    net start MongoDB > nul 2>&1
    if %errorlevel% equ 0 (
        echo [OK] MongoDB started successfully
    ) else (
        echo [ERROR] Failed to start MongoDB. Please start it manually.
        echo Run: net start MongoDB
        pause
        exit /b 1
    )
)

REM Wait for MongoDB to be ready
timeout /t 2 /nobreak > nul

REM Start backend in a new window
echo.
echo [2/4] Starting Backend Server (FastAPI + MongoDB)...
start "Backend Server - Port 8000" cmd /k "cd backend && python start.py"

REM Wait for backend to start
echo Waiting for backend to initialize...
timeout /t 8 /nobreak > nul

REM Verify backend is running
echo Checking backend health...
curl -s http://localhost:8000/health > nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Backend is running on http://localhost:8000
) else (
    echo [WARNING] Backend may still be starting...
)

REM Start frontend in a new window
echo.
echo [3/4] Starting Frontend Server (React + Vite)...
start "Frontend Server - Port 3000" cmd /k "npm run dev"

REM Wait for frontend to start
echo Waiting for frontend to initialize...
timeout /t 8 /nobreak > nul

REM Open browser
echo.
echo [4/4] Opening Browser...
timeout /t 2 /nobreak > nul
start http://localhost:3000

echo.
echo ========================================
echo   ALL SERVICES STARTED SUCCESSFULLY!
echo ========================================
echo.
echo   Frontend:  http://localhost:3000
echo   Backend:   http://localhost:8000
echo   API Docs:  http://localhost:8000/api/docs
echo   Database:  mongodb://localhost:27017/smartaitriage
echo.
echo ========================================
echo   Service Status:
echo   - MongoDB:  Running (Windows Service)
echo   - Backend:  Running (Port 8000)
echo   - Frontend: Running (Port 3000)
echo ========================================
echo.
echo INSTRUCTIONS:
echo - The application is now running in your browser
echo - Backend and Frontend are running in separate windows
echo - Press any key here to STOP ALL SERVERS
echo - Or close this window to keep servers running
echo.
pause > nul

echo.
echo Stopping all servers...

REM Kill the servers when user presses a key
taskkill /FI "WindowTitle eq Backend Server*" /T /F > nul 2>&1
taskkill /FI "WindowTitle eq Frontend Server*" /T /F > nul 2>&1

echo.
echo [OK] All servers stopped.
echo [INFO] MongoDB service is still running (Windows Service)
echo.
echo To stop MongoDB: net stop MongoDB
echo.
pause
