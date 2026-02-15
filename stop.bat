@echo off
title AI Smart Patient Triage - Stop All Services
color 0C

echo.
echo ========================================
echo   Stopping All Services
echo ========================================
echo.

echo [1/3] Stopping Frontend Server...
taskkill /FI "WindowTitle eq Frontend Server*" /T /F > nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Frontend stopped
) else (
    echo [INFO] Frontend was not running
)

echo.
echo [2/3] Stopping Backend Server...
taskkill /FI "WindowTitle eq Backend Server*" /T /F > nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Backend stopped
) else (
    echo [INFO] Backend was not running
)

REM Also kill any Python processes running uvicorn
taskkill /F /IM python.exe /FI "WINDOWTITLE eq Backend*" > nul 2>&1

REM Kill any node processes for Vite
taskkill /F /IM node.exe /FI "WINDOWTITLE eq Frontend*" > nul 2>&1

echo.
echo [3/3] MongoDB Service Status...
sc query MongoDB | find "RUNNING" > nul
if %errorlevel% equ 0 (
    echo [INFO] MongoDB is still running (Windows Service)
    echo [INFO] To stop MongoDB: net stop MongoDB
) else (
    echo [INFO] MongoDB is not running
)

echo.
echo ========================================
echo   All application servers stopped!
echo ========================================
echo.
pause
