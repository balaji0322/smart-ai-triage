@echo off
echo ========================================
echo   Starting MongoDB with Docker
echo ========================================
echo.

echo Checking Docker Desktop...
docker info >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Docker Desktop is not running!
    echo.
    echo Please start Docker Desktop and try again.
    echo Or install MongoDB locally from: https://www.mongodb.com/try/download/community
    echo.
    pause
    exit /b 1
)

echo [OK] Docker is running
echo.

echo Starting MongoDB container...
docker run -d --name mongodb-triage -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=admin123 mongo:7

if %ERRORLEVEL% EQU 0 (
    echo [OK] MongoDB container started
    echo.
    echo Waiting for MongoDB to be ready...
    timeout /t 5 /nobreak >nul
    echo.
    echo ========================================
    echo   MongoDB is ready!
    echo ========================================
    echo   Connection: mongodb://admin:admin123@localhost:27017
    echo   Database: triage_db
    echo ========================================
    echo.
) else (
    echo [INFO] MongoDB container may already exist
    echo Starting existing container...
    docker start mongodb-triage
    echo.
)

echo You can now start the backend server.
echo.
pause
