# Script to start the entire application locally
Write-Host "=== LinkedIn Recruiter Followups - Local Setup ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Start Database
Write-Host "Step 1: Starting local database..." -ForegroundColor Yellow
& .\start-database.ps1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to start database. Please fix Docker issues first." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 2: Starting backend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "Step 3: Starting frontend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm start"

Write-Host ""
Write-Host "=== Application Starting ===" -ForegroundColor Green
Write-Host "Backend: http://localhost:3001" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Please wait a few seconds for servers to start..." -ForegroundColor Yellow
Write-Host "Check the PowerShell windows that opened for server logs." -ForegroundColor Yellow

