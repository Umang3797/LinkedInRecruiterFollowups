import express from 'express';
import { loginToLinkedIn, getIsLoggedIn, closeBrowser } from '../services/linkedin-automation';
import { sendFollowUpMessage, checkAndSendFirstMessage } from '../services/automation-service';

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

// Check and send first message for profiles waiting for connection acceptance
router.post('/check-connections', async (req, res) => {
  try {
    const { profileId } = req.body;
    
    if (profileId) {
      // Check specific profile
      const result = await checkAndSendFirstMessage(parseInt(profileId));
      res.json(result);
    } else {
      // Check all pending connections
      const { db } = require('../db/init');
      const pendingProfiles = db.prepare(`
        SELECT id FROM profiles 
        WHERE status = 'connection_request_sent' AND connection_accepted = 0
      `).all() as any[];

      const results = [];
      for (const profile of pendingProfiles) {
        try {
          const result = await checkAndSendFirstMessage(profile.id);
          results.push({ profileId: profile.id, ...result });
        } catch (error: any) {
          results.push({ profileId: profile.id, success: false, error: error.message });
        }
      }
      res.json({ results });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to check connections' });
  }
});

export default router;

