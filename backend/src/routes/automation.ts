import express from 'express';
import { loginToLinkedIn, getIsLoggedIn, closeBrowser } from '../services/linkedin-automation';
import { sendFollowUpMessage } from '../services/automation-service';
import { pool } from '../db/init';

const router = express.Router();

// Check login status
router.get('/status', async (req, res) => {
  try {
    const isLoggedIn = getIsLoggedIn();
    res.json({ isLoggedIn });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check status' });
  }
});

// Login to LinkedIn
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    await loginToLinkedIn(email, password);
    res.json({ success: true, message: 'Logged in successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Login failed' });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  try {
    await closeBrowser();
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
});

// Manually trigger follow-up for a profile
router.post('/followup/:profileId', async (req, res) => {
  try {
    const { profileId } = req.params;
    const { messageType } = req.body;

    if (!messageType || !['followup_1', 'followup_2', 'followup_3'].includes(messageType)) {
      return res.status(400).json({ error: 'Invalid message type' });
    }

    const result = await sendFollowUpMessage(parseInt(profileId), messageType);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to send follow-up' });
  }
});

// Check and update connection status
router.post('/check-connections', async (req, res) => {
  try {
    // This would check LinkedIn for accepted connections
    // For now, we'll just return a message that this needs manual verification
    res.json({ message: 'Connection status check - to be implemented' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check connections' });
  }
});

export default router;

