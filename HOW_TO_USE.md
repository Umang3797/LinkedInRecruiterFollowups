# How to Use LinkedIn Recruiter Followups

## 🚀 Quick Start Guide

### Step 1: Access the Application

1. **Open your web browser** (Chrome, Firefox, Edge, etc.)
2. **Navigate to**: `http://localhost:3000`
3. You should see the **LinkedIn Recruiter Followups Dashboard**

---

## 📋 Complete Usage Guide

### **Step 1: Login to LinkedIn**

1. On the dashboard, find the **"LinkedIn Connection"** section
2. You have two options:
   
   **Option A: Manual Login (Recommended)**
   - Click the **"Manual Login (Browser)"** button
   - A browser window will open automatically
   - Log in to your LinkedIn account in that window
   - Once logged in, the dashboard will show: ✅ **"Connected to LinkedIn"** (green status)
   
   **Option B: Credentials Login**
   - Enter your LinkedIn email
   - Enter your LinkedIn password
   - Click **"Login with Credentials"**
   - ⚠️ Note: This may not work if you have 2FA enabled

3. **Verify**: You should see a green indicator showing "Connected to LinkedIn"

---

### **Step 2: Add LinkedIn Profiles**

1. Scroll to the **"Add LinkedIn Profiles"** section
2. In the text area, enter LinkedIn profile URLs
   
   **Single Profile:**
   ```
   https://www.linkedin.com/in/umang-mavani
   ```
   
   **Multiple Profiles (comma-separated):**
   ```
   https://www.linkedin.com/in/recruiter1, https://www.linkedin.com/in/recruiter2, https://www.linkedin.com/in/recruiter3
   ```
   
3. Click the **"Add Profiles"** button
4. The system will:
   - Extract profile information (name, company, position)
   - Send connection requests automatically
   - If messaging is open, send the initial message
   - Update the dashboard with status

5. **Success Message**: You'll see "Successfully added X profile(s)"

---

### **Step 3: View Dashboard**

The **Profiles Dashboard** table shows:

| Column | Description |
|--------|-------------|
| **Name** | LinkedIn profile name (if found) |
| **Company** | Company name (if found) |
| **Position** | Job title (if found) |
| **Status** | Current status (color-coded badge) |
| **Last Message** | Date of last message sent |
| **Profile URL** | Click to view LinkedIn profile |

**Status Types:**
- 🟡 **Pending** - Profile added, processing
- 🟡 **Connection Request Sent** - Waiting for acceptance
- 🔵 **Connection Accepted** - Ready for messaging
- 🟢 **1st Message Sent** - Initial message sent
- 🟢 **2nd Message Sent** - First follow-up sent (3 days)
- 🟢 **3rd Message Sent** - Second follow-up sent (6 days)
- 🔴 **No Reply** - All follow-ups sent, no response
- 🔴 **Error** - An error occurred

---

### **Step 4: Customize Message Templates**

1. Click the **"Edit Message Templates"** button (top of dashboard)
2. A modal window will open with 4 message templates:
   
   - **Initial Message**: Sent when connection is accepted (if messaging open)
   - **First Follow-up**: Sent 3 days after initial message if no reply
   - **Second Follow-up**: Sent 6 days after initial message if no reply
   - **Third Follow-up**: Sent 9 days after initial message if no reply

3. **Edit the messages** as needed
4. Use `{name}` as a placeholder - it will be replaced with the recipient's name
   
   Example:
   ```
   Hi {name}, I came across your profile and would love to connect!
   ```
   Becomes:
   ```
   Hi John Doe, I came across your profile and would love to connect!
   ```

5. Click **"Save Templates"** when done
6. The modal will close and your changes are saved

---

### **Step 5: Monitor Progress**

1. **Refresh the Dashboard**: Click the **"Refresh"** button to update statuses
2. **Check Status Updates**: Profiles automatically update as:
   - Connection requests are sent
   - Messages are delivered
   - Follow-ups are scheduled
3. **View Last Message Date**: See when the last message was sent to each profile

---

## 🔄 Automatic Follow-up System

The system **automatically** sends follow-up messages:

- **3 days** after initial message → Sends 1st follow-up
- **6 days** after initial message → Sends 2nd follow-up  
- **9 days** after initial message → Sends 3rd follow-up
- After 3rd follow-up → Status changes to "No Reply"

**Note**: The scheduler runs every hour to check for profiles needing follow-ups.

---

## 📊 Example Workflow

### Complete Example:

1. **Login**: Click "Manual Login (Browser)" → Login to LinkedIn
2. **Add Profile**: 
   ```
   https://www.linkedin.com/in/recruiter-john
   ```
3. **Watch Status**:
   - Status changes to "Connection Request Sent"
   - If messaging open → Status changes to "1st Message Sent"
4. **Wait 3 Days**: System automatically sends follow-up
   - Status changes to "2nd Message Sent"
5. **Wait 3 More Days**: System sends another follow-up
   - Status changes to "3rd Message Sent"
6. **Final**: If no reply → Status changes to "No Reply"

---

## 🛠️ Troubleshooting

### **Issue: Can't Login to LinkedIn**
- Use "Manual Login (Browser)" instead of credentials
- Make sure you complete the login in the browser window
- Check if LinkedIn requires 2FA (use manual login)

### **Issue: Profiles Not Adding**
- Check that URLs are valid LinkedIn profile URLs
- Make sure you're logged in to LinkedIn first
- Check browser console for errors

### **Issue: Messages Not Sending**
- Verify connection is accepted (status should be "Connection Accepted")
- Check if messaging is open on the profile
- Verify message templates are set

### **Issue: Status Not Updating**
- Click the "Refresh" button
- Wait a few seconds and refresh again
- Check backend logs for errors

### **Issue: Follow-ups Not Triggering**
- The scheduler runs every hour
- Check that messages were sent successfully
- Verify the time difference (3 days between messages)

---

## 💡 Tips & Best Practices

1. **Start Small**: Test with 1-2 profiles first
2. **Customize Messages**: Edit templates to match your style
3. **Monitor Regularly**: Check the dashboard daily
4. **Be Patient**: Follow-ups are sent automatically after 3 days
5. **Respect Limits**: Don't add too many profiles at once (LinkedIn may rate limit)

---

## 📁 Data Storage

All your data is stored locally:
- **Database**: `data/linkedin_followups.db`
- **No Cloud**: Everything stays on your computer
- **Backup**: Just copy the `.db` file to backup

---

## 🎯 Quick Reference

| Action | How To |
|--------|--------|
| **Login** | Click "Manual Login (Browser)" |
| **Add Profile** | Enter URL → Click "Add Profiles" |
| **Edit Messages** | Click "Edit Message Templates" |
| **Refresh** | Click "Refresh" button |
| **View Profile** | Click "View Profile" link in table |

---

## ✅ Success Indicators

You'll know everything is working when:
- ✅ Green "Connected to LinkedIn" status
- ✅ Profiles appear in the dashboard table
- ✅ Status badges update automatically
- ✅ Messages are sent successfully
- ✅ Follow-ups are scheduled automatically

---

**Ready to start? Open http://localhost:3000 in your browser!** 🚀

