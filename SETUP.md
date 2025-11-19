# Quick Setup Guide

## 🚀 Quick Start (5 Minutes)

### Prerequisites Check
```bash
node --version    # Should be v18+
npm --version     # Should be v9+
psql --version    # PostgreSQL should be installed
```

### Step-by-Step Setup

#### 1. Install All Dependencies
```bash
# From project root
npm run install:all
```

#### 2. Set Up Database

**Option A: Local PostgreSQL**
```bash
createdb linkedin_followups
```

**Option B: Docker (PostgreSQL only)**
```bash
docker run --name linkedin-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=linkedin_followups -p 5432:5432 -d postgres:15-alpine
```

#### 3. Configure Environment

**Backend** - Create `backend/.env`:
```env
PORT=3001
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/linkedin_followups
SESSION_SECRET=change-this-secret-key
PLAYWRIGHT_HEADLESS=true
PLAYWRIGHT_SLOW_MO=1000
```

**Frontend** - Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:3001/api
```

#### 4. Install Playwright Browser
```bash
cd backend
npx playwright install chromium
```

#### 5. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

#### 6. Access the Application
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## 🧪 Quick Test

1. Open http://localhost:3000
2. Click "Manual Login (Browser)" and login to LinkedIn
3. Add a test profile: `https://www.linkedin.com/in/umang-mavani`
4. Check the dashboard for the profile status

## 🐳 Docker Setup (Alternative)

```bash
docker-compose up --build
```

This starts everything automatically!

## ❓ Common Issues

**Database connection error?**
- Check PostgreSQL is running: `pg_isready`
- Verify DATABASE_URL in backend/.env

**Playwright errors?**
- Run: `cd backend && npx playwright install chromium`

**Port already in use?**
- Change PORT in backend/.env
- Update REACT_APP_API_URL in frontend/.env

## 📚 Full Documentation

See [README.md](./README.md) for complete documentation.

