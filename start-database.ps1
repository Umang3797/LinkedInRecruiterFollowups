# Script to start local PostgreSQL database for LinkedIn Followups
Write-Host "Starting local PostgreSQL database..." -ForegroundColor Green

# Check if Docker is running
$dockerStatus = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "`nDocker Desktop is not running or is paused!" -ForegroundColor Red
    Write-Host "Please:" -ForegroundColor Yellow
    Write-Host "1. Open Docker Desktop" -ForegroundColor Yellow
    Write-Host "2. Click 'Resume' if it's paused" -ForegroundColor Yellow
    Write-Host "3. Wait for Docker to start" -ForegroundColor Yellow
    Write-Host "4. Run this script again`n" -ForegroundColor Yellow
    exit 1
}

# Check if container already exists
$existingContainer = docker ps -a --filter "name=linkedin-followups-db" --format "{{.Names}}"
if ($existingContainer -eq "linkedin-followups-db") {
    Write-Host "Database container already exists. Starting it..." -ForegroundColor Yellow
    docker start linkedin-followups-db
} else {
    Write-Host "Creating new database container..." -ForegroundColor Yellow
    # Start only the postgres service from docker-compose
    docker-compose up -d postgres
}

Write-Host "`nWaiting for database to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Check if database is ready
$maxAttempts = 30
$attempt = 0
do {
    $attempt++
    $healthCheck = docker exec linkedin-followups-db pg_isready -U postgres 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✓ Database is ready!" -ForegroundColor Green
        Write-Host "Database running on: localhost:5432" -ForegroundColor Cyan
        Write-Host "Database name: linkedin_followups" -ForegroundColor Cyan
        Write-Host "Username: postgres" -ForegroundColor Cyan
        Write-Host "Password: postgres`n" -ForegroundColor Cyan
        exit 0
    }
    Write-Host "." -NoNewline
    Start-Sleep -Seconds 1
} while ($attempt -lt $maxAttempts)

Write-Host "`nDatabase is taking longer than expected. Please check Docker Desktop." -ForegroundColor Yellow

