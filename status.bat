@echo off
title AI Smart Patient Triage - Service Status
color 0B

echo.
echo ========================================
echo   AI Smart Patient Triage System
echo   Service Status Check
echo ========================================
echo.

REM Check MongoDB
echo [1/4] MongoDB Service:
sc query MongoDB | find "RUNNING" > nul
if %errorlevel% equ 0 (
    echo [OK] MongoDB is RUNNING
    echo     Connection: mongodb://localhost:27017/smartaitriage
) else (
    echo [X] MongoDB is NOT RUNNING
    echo     Start with: net start MongoDB
)

echo.
REM Check Backend
echo [2/4] Backend Server (Port 8000):
netstat -ano | findstr :8000 | findstr LISTENING > nul
if %errorlevel% equ 0 (
    echo [OK] Backend is RUNNING
    curl -s http://localhost:8000/health > nul 2>&1
    if %errorlevel% equ 0 (
        echo     Health Check: PASSED
        echo     URL: http://localhost:8000
        echo     API Docs: http://localhost:8000/api/docs
    ) else (
        echo     Health Check: FAILED (server may be starting)
    )
) else (
    echo [X] Backend is NOT RUNNING
    echo     Start with: cd backend && python start.py
)

echo.
REM Check Frontend
echo [3/4] Frontend Server (Port 3000):
netstat -ano | findstr :3000 | findstr LISTENING > nul
if %errorlevel% equ 0 (
    echo [OK] Frontend is RUNNING
    echo     URL: http://localhost:3000
) else (
    echo [X] Frontend is NOT RUNNING
    echo     Start with: npm run dev
)

echo.
REM Check if ports are in use
echo [4/4] Port Status:
netstat -ano | findstr :8000 > nul
if %errorlevel% equ 0 (
    echo [OK] Port 8000 (Backend) - IN USE
) else (
    echo [ ] Port 8000 (Backend) - AVAILABLE
)

netstat -ano | findstr :3000 > nul
if %errorlevel% equ 0 (
    echo [OK] Port 3000 (Frontend) - IN USE
) else (
    echo [ ] Port 3000 (Frontend) - AVAILABLE
)

netstat -ano | findstr :27017 > nul
if %errorlevel% equ 0 (
    echo [OK] Port 27017 (MongoDB) - IN USE
) else (
    echo [ ] Port 27017 (MongoDB) - AVAILABLE
)

echo.
echo ========================================
echo   Quick Actions:
echo ========================================
echo   Start All:  start.bat
echo   Stop All:   stop.bat
echo   Check This: status.bat
echo ========================================
echo.
pause
