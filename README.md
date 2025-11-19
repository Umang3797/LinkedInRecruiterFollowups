# LinkedIn Recruiter Followups

A comprehensive dashboard for managing and automating follow-ups with LinkedIn recruiters. This tool helps you track connections, send automated messages, and manage your recruiter outreach efficiently.

## Features

- **Profile Management**: Add multiple LinkedIn profiles via comma-separated URLs
- **Automated Connection Requests**: Automatically send connection requests to recruiters
- **Smart Messaging**: Send initial messages and follow-ups based on configurable timelines
- **Status Tracking**: Real-time dashboard showing connection status, message history, and follow-up progress
- **Customizable Messages**: Edit message templates for initial and follow-up messages
- **Automated Follow-ups**: Automatic follow-up messages after 3, 6, and 9 days if no reply
- **LinkedIn Integration**: Secure login and automation using Playwright
- **File-Based Database**: Uses SQLite - no external database server needed!

## Tech Stack

- **Frontend**: React 19 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: SQLite (file-based, stored in `data/` folder)
- **Automation**: Playwright (browser automation)
- **Scheduling**: node-cron

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Git**

**No database server installation needed!** SQLite is included and runs automatically.

## Project Structure

```
LinkedInRecruiterFollowups/
├── backend/              # Express API server
│   ├── src/
│   │   ├── db/          # Database initialization (SQLite)
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic (automation, scheduler)
│   │   └── types/       # TypeScript types
│   ├── database/
│   │   └── schema.sql   # SQL schema file
│   └── package.json
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API client
│   │   └── App.tsx
│   └── package.json
├── data/                # SQLite database file (created automatically)
│   └── linkedin_followups.db
└── README.md
```

## Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/Umang3797/LinkedInRecruiterFollowups.git
cd LinkedInRecruiterFollowups
```

### Step 2: Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 3: Configure Environment Variables

**Backend Configuration** (`backend/.env`):

```env
PORT=3001
NODE_ENV=development
SESSION_SECRET=your-secret-key-change-this-in-production
PLAYWRIGHT_HEADLESS=true
PLAYWRIGHT_SLOW_MO=1000
```

**Frontend Configuration** (`frontend/.env`):

```env
REACT_APP_API_URL=http://localhost:3001/api
```

**Note**: The SQLite database will be automatically created in the `data/` folder when you first run the backend. No database setup needed!

### Step 4: Install Playwright Browsers

```bash
cd backend
npx playwright install chromium
```

### Step 5: Start the Application

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

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Database**: `data/linkedin_followups.db` (SQLite file)

## Database

This project uses **SQLite**, a file-based database that requires no server setup:

- **Location**: `data/linkedin_followups.db` (created automatically)
- **Schema**: See `backend/database/schema.sql`
- **No Installation**: SQLite is included with Node.js
- **No Configuration**: Database is created automatically on first run
- **Portable**: The `.db` file contains all your data

### Database Schema

The database includes these tables:
- `profiles` - LinkedIn profile information and status
- `messages` - Message history
- `connection_attempts` - Connection request logs
- `settings` - Message templates

See `backend/database/schema.sql` for the complete schema.

## Usage Guide

### Step 1: Login to LinkedIn

1. Open the dashboard at http://localhost:3000
2. In the "LinkedIn Connection" section, click **"Manual Login (Browser)"** or enter your credentials
3. If using manual login, a browser window will open - complete the LinkedIn login there
4. Once logged in, you'll see a green "Connected to LinkedIn" status

### Step 2: Add LinkedIn Profiles

1. In the "Add LinkedIn Profiles" section, enter one or more LinkedIn profile URLs
2. Separate multiple URLs with commas:
   ```
   https://www.linkedin.com/in/recruiter1, https://www.linkedin.com/in/recruiter2
   ```
3. Click **"Add Profiles"**
4. The system will:
   - Extract profile information (name, company, position)
   - Send connection requests
   - If messaging is open, send the initial message
   - Update the dashboard with status

### Step 3: Customize Message Templates

1. Click **"Edit Message Templates"** button
2. Edit the templates for:
   - **Initial Message**: Sent when connection is accepted (if messaging open)
   - **First Follow-up**: Sent 3 days after initial message if no reply
   - **Second Follow-up**: Sent 6 days after initial message if no reply
   - **Third Follow-up**: Sent 9 days after initial message if no reply
3. Use `{name}` as a placeholder for the recipient's name
4. Click **"Save Templates"**

### Step 4: Monitor Dashboard

The dashboard shows:
- **Name**: Profile name (if found)
- **Company**: Company name (if found)
- **Position**: Job title (if found)
- **Status**: Current status (color-coded badges)
- **Last Message**: Date of last message sent
- **Profile URL**: Link to LinkedIn profile

### Step 5: Automatic Follow-ups

The system automatically:
- Checks every hour for profiles needing follow-ups
- Sends follow-up messages 3, 6, and 9 days after the previous message
- Updates status automatically
- Stops after the 3rd follow-up if no reply

## Status Types

- **Pending**: Profile added but not processed yet
- **Connection Request Sent**: Connection request sent, waiting for acceptance
- **Connection Accepted**: Connection accepted, ready for messaging
- **1st Message Sent**: Initial message sent
- **2nd Message Sent**: First follow-up sent (3 days)
- **3rd Message Sent**: Second follow-up sent (6 days)
- **No Reply**: All follow-ups sent, no reply received
- **Error**: An error occurred during processing

## Testing Guide

### Test 1: Basic Functionality

1. **Start the application** (backend and frontend)
2. **Login to LinkedIn** using the dashboard
3. **Add a test profile**:
   ```
   https://www.linkedin.com/in/umang-mavani
   ```
4. **Verify**:
   - Profile appears in the dashboard
   - Status updates to "Connection Request Sent" or "1st Message Sent"
   - Profile information is extracted

### Test 2: Multiple Profiles

1. **Add multiple profiles**:
   ```
   https://www.linkedin.com/in/profile1, https://www.linkedin.com/in/profile2, https://www.linkedin.com/in/profile3
   ```
2. **Verify**:
   - All profiles appear in the dashboard
   - Each profile is processed independently
   - Status updates correctly for each

### Test 3: Message Templates

1. **Click "Edit Message Templates"**
2. **Modify a template** (e.g., Initial Message)
3. **Save** and verify the change is saved
4. **Add a new profile** and verify the new template is used

### Test 4: Database

1. **Check database file**:
   ```bash
   # Database file location
   ls data/linkedin_followups.db
   ```
2. **View database** (optional - use SQLite browser):
   - Download DB Browser for SQLite: https://sqlitebrowser.org/
   - Open `data/linkedin_followups.db`

## API Endpoints

### Profiles
- `GET /api/profiles` - Get all profiles
- `GET /api/profiles/:id` - Get single profile
- `POST /api/profiles` - Add new profiles
- `PATCH /api/profiles/:id` - Update profile status
- `DELETE /api/profiles/:id` - Delete profile

### Messages
- `GET /api/messages/templates` - Get message templates
- `PUT /api/messages/templates/:key` - Update template
- `GET /api/messages/profile/:profileId` - Get messages for a profile

### Automation
- `GET /api/automation/status` - Check login status
- `POST /api/automation/login` - Login to LinkedIn
- `POST /api/automation/logout` - Logout from LinkedIn
- `POST /api/automation/followup/:profileId` - Send follow-up message

## Troubleshooting

### Issue: Database File Not Created

**Solution:**
- Ensure `data/` folder exists (created automatically)
- Check file permissions
- Verify backend has write access to project directory

### Issue: Playwright Browser Not Found

**Solution:**
```bash
cd backend
npx playwright install chromium
```

### Issue: LinkedIn Login Fails

**Solution:**
- Use manual login instead of credentials
- Check if LinkedIn requires 2FA (use manual login)
- Ensure browser automation is not blocked

### Issue: Messages Not Sending

**Solution:**
- Verify you're logged in to LinkedIn
- Check if connection is accepted
- Verify message templates are set
- Check browser console for errors

### Issue: Follow-ups Not Triggering

**Solution:**
- Verify scheduler is running (check backend logs)
- Check database for message timestamps
- Manually trigger follow-up to test

## Important Notes

⚠️ **LinkedIn Automation Warning**: 
- This tool uses browser automation which may violate LinkedIn's Terms of Service
- Use at your own risk - account restrictions are possible
- Consider using delays and rate limiting
- LinkedIn may detect and block automated activity

🔒 **Security**:
- Never commit `.env` files
- Use strong `SESSION_SECRET` in production
- Store credentials securely
- Use environment variables for sensitive data

💾 **Database**:
- SQLite database file is stored in `data/linkedin_followups.db`
- Backup this file regularly
- The database file contains all your data
- No external database server needed!

## Production Deployment

### Backend Deployment (Railway/Render/Heroku)

1. Set environment variables in your hosting platform
2. Deploy backend code
3. Update `REACT_APP_API_URL` in frontend
4. **Note**: SQLite works great for small to medium deployments. For high-traffic, consider PostgreSQL.

### Frontend Deployment (Vercel/Netlify)

1. Set `REACT_APP_API_URL` to your backend URL
2. Deploy frontend
3. Configure CORS on backend to allow frontend domain

### Database Backup

To backup your SQLite database:
```bash
cp data/linkedin_followups.db data/linkedin_followups_backup.db
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Open an issue on GitHub
- Check the troubleshooting section
- Review the API documentation

---

**Built with ❤️ for efficient LinkedIn recruiter outreach**

**Database**: SQLite - Simple, file-based, no server needed!
