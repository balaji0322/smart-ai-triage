@echo off
echo ========================================
echo   MongoDB Setup for AI Smart Triage
echo ========================================
echo.

echo Checking if MongoDB is installed...
where mongod >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] MongoDB is installed
    echo.
    
    echo Starting MongoDB service...
    net start MongoDB >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo [OK] MongoDB service started
    ) else (
        echo [INFO] MongoDB service already running or needs admin rights
    )
    echo.
    
    echo Testing MongoDB connection...
    mongosh --eval "db.version()" --quiet >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo [OK] MongoDB is accessible
        echo.
        echo Creating indexes...
        mongosh triage_db --eval "db.users.createIndex({ 'email': 1 }, { unique: true }); db.patients.createIndex({ 'user_id': 1 }, { unique: true }); db.triage_records.createIndex({ 'patient_id': 1 }); db.triage_records.createIndex({ 'status': 1 }); db.triage_records.createIndex({ 'created_at': -1 }); db.audit_logs.createIndex({ 'timestamp': -1 });" --quiet
        echo [OK] Indexes created
    ) else (
        echo [WARNING] Could not connect to MongoDB
    )
) else (
    echo [ERROR] MongoDB is not installed
    echo.
    echo Please install MongoDB:
    echo 1. Download from: https://www.mongodb.com/try/download/community
    echo 2. Or use Docker: docker-compose up -d mongodb
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   MongoDB Setup Complete!
echo ========================================
echo.
echo MongoDB is running on: mongodb://localhost:27017
echo Database name: triage_db
echo.
echo You can now start the application with: start.bat
echo.
pause
