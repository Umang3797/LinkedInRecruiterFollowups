# Local Database Setup Guide

This project uses a **local PostgreSQL database only** - no cloud connections required!

## Quick Start (Using Docker - Recommended)

### Step 1: Start Docker Desktop
1. Open Docker Desktop from your system tray or Start menu
2. If it shows "Paused", click **"Resume"** or **"Start"**
3. Wait until Docker Desktop shows "Running" status

### Step 2: Start Local Database
Run this command in PowerShell from the project root:

```powershell
docker-compose up -d postgres
```

This will:
- Download PostgreSQL 15 (if not already downloaded)
- Create a local database container
- Store all data locally in Docker volumes
- Run on `localhost:5432`

### Step 3: Verify Database is Running
```powershell
docker ps
```

You should see `linkedin-followups-db` container running.

### Step 4: Start Your Application
The database is now ready! Your backend will automatically:
- Connect to the local database
- Create all required tables
- Be ready to use

## Database Details (Local Only)

- **Host**: localhost
- **Port**: 5432
- **Database**: linkedin_followups
- **Username**: postgres
- **Password**: postgres
- **Location**: Stored locally in Docker volume (no cloud)

## Alternative: Install PostgreSQL Locally

If you prefer not to use Docker:

1. **Download PostgreSQL**: https://www.postgresql.org/download/windows/
2. **Install** with default settings
3. **Create database**:
   ```sql
   CREATE DATABASE linkedin_followups;
   ```
4. **Update `backend/.env`**:
   ```
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/linkedin_followups
   ```

## Stop Database

To stop the local database:
```powershell
docker-compose stop postgres
```

To remove the database (data will be lost):
```powershell
docker-compose down postgres
```

## Important Notes

✅ **All data is stored locally** - nothing goes to the cloud
✅ **Database runs on your machine only**
✅ **No internet connection needed** for database operations
✅ **Data persists** between restarts (stored in Docker volume)

