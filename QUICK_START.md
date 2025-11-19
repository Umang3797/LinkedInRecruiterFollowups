# Quick Start Guide

## ✅ Step 1: Install Dependencies

```bash
# Install all dependencies
npm run install:all
```

Or manually:
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

## ✅ Step 2: Install Playwright Browser

```bash
cd backend
npx playwright install chromium
```

## ✅ Step 3: Configure Environment (Optional)

**Backend** (`backend/.env`):
```env
PORT=3001
NODE_ENV=development
SESSION_SECRET=your-secret-key
PLAYWRIGHT_HEADLESS=true
PLAYWRIGHT_SLOW_MO=1000
```

**Frontend** (`frontend/.env`):
```env
REACT_APP_API_URL=http://localhost:3001/api
```

**Note**: Database is created automatically! No setup needed.

## ✅ Step 4: Start Backend

```bash
cd backend
npm run dev
```

Wait for: `Server running on http://localhost:3001`

## ✅ Step 5: Start Frontend

Open a new terminal:

```bash
cd frontend
npm start
```

Wait for: Browser opens at `http://localhost:3000`

## 🎉 Done!

Your application is now running:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **Database**: `data/linkedin_followups.db` (created automatically)

## 📊 Database

- **Location**: `data/linkedin_followups.db`
- **Type**: SQLite (file-based)
- **No Server**: Runs automatically, no installation needed
- **Backup**: Just copy the `.db` file!

## 🚀 First Steps

1. **Login to LinkedIn** in the dashboard
2. **Add profiles**: Enter LinkedIn URLs (comma-separated)
3. **Edit templates**: Customize your messages
4. **Monitor**: Watch the dashboard for status updates

## ❓ Troubleshooting

**Database not created?**
→ Check `data/` folder exists
→ Verify backend has write permissions

**Backend won't start?**
→ Check if port 3001 is available
→ Verify all dependencies installed

**Frontend won't start?**
→ Check if port 3000 is available
→ Verify `frontend/.env` is configured

---

**That's it! No Docker, no database server - just run and go!** 🚀
