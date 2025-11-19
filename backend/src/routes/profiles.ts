import express from 'express';
import { db } from '../db/init';
import { processProfile } from '../services/automation-service';

const router = express.Router();

// Get all profiles
router.get('/', async (req, res) => {
  try {
    const profiles = db.prepare(`
      SELECT p.*,
             (SELECT MAX(sent_at) FROM messages WHERE profile_id = p.id AND status = 'sent') as last_message_sent
      FROM profiles p
      ORDER BY p.created_at DESC
    `).all();
    res.json(profiles);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    res.status(500).json({ error: 'Failed to fetch profiles' });
  }
});

// Get single profile
router.get('/:id', async (req, res) => {
  try {
    const profile = db.prepare('SELECT * FROM profiles WHERE id = ?').get(req.params.id);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Add new profiles
router.post('/', async (req, res) => {
  try {
    const { profiles } = req.body; // Array of LinkedIn URLs or comma-separated string
    
    if (!profiles) {
      return res.status(400).json({ error: 'Profiles are required' });
    }

    // Parse comma-separated string or use array
    const profileUrls = typeof profiles === 'string' 
      ? profiles.split(',').map(url => url.trim()).filter(url => url)
      : Array.isArray(profiles) ? profiles : [profiles];

    const results = [];

    for (const url of profileUrls) {
      try {
        const result = await processProfile(url);
        results.push({ url, success: true, profileId: result.profileId });
      } catch (error: any) {
        results.push({ url, success: false, error: error.message });
      }
    }

    res.json({ results });
  } catch (error) {
    console.error('Error adding profiles:', error);
    res.status(500).json({ error: 'Failed to add profiles' });
  }
});

// Update profile status
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const update = db.prepare(
      'UPDATE profiles SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    );
    update.run(status, req.params.id);
    
    const profile = db.prepare('SELECT * FROM profiles WHERE id = ?').get(req.params.id);
    res.json(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Delete profile
router.delete('/:id', async (req, res) => {
  try {
    db.prepare('DELETE FROM profiles WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({ error: 'Failed to delete profile' });
  }
});

export default router;
