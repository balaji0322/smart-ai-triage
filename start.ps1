# AI Smart Patient Triage System Startup Script
Write-Host "Starting AI Smart Patient Triage System..." -ForegroundColor Cyan
Write-Host ""

# Start Backend
Write-Host "[1/3] Starting Backend Server..." -ForegroundColor Yellow
$backendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; python start.py" -PassThru

# Wait for backend to initialize
Start-Sleep -Seconds 5

# Start Frontend
Write-Host "[2/3] Starting Frontend Server..." -ForegroundColor Yellow
$frontendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -PassThru

# Wait for frontend to initialize
Start-Sleep -Seconds 5

# Open Browser
Write-Host "[3/3] Opening Browser..." -ForegroundColor Yellow
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  AI Smart Patient Triage System" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "  Backend:  http://localhost:8000" -ForegroundColor White
Write-Host "  API Docs: http://localhost:8000/api/docs" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop all servers..." -ForegroundColor Yellow
Write-Host ""

# Keep script running and monitor processes
try {
    while ($true) {
        if ($backendJob.HasExited -or $frontendJob.HasExited) {
            Write-Host "One of the servers has stopped. Cleaning up..." -ForegroundColor Red
            break
        }
        Start-Sleep -Seconds 2
    }
}
finally {
    # Cleanup
    Write-Host "Stopping servers..." -ForegroundColor Yellow
    if (-not $backendJob.HasExited) {
        Stop-Process -Id $backendJob.Id -Force -ErrorAction SilentlyContinue
    }
    if (-not $frontendJob.HasExited) {
        Stop-Process -Id $frontendJob.Id -Force -ErrorAction SilentlyContinue
    }
    Write-Host "Servers stopped." -ForegroundColor Green
}
