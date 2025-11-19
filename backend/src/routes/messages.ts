import express from 'express';
import { db } from '../db/init';

const router = express.Router();

// Get all message templates
router.get('/templates', async (req, res) => {
  try {
    const templates = db.prepare('SELECT * FROM settings WHERE key LIKE ?').all('%message%');
    res.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// Update message template
router.put('/templates/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    const update = db.prepare(
      'UPDATE settings SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?'
    );
    const result = update.run(value, key);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Template not found' });
    }

    const template = db.prepare('SELECT * FROM settings WHERE key = ?').get(key);
    res.json(template);
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ error: 'Failed to update template' });
  }
});

// Get messages for a profile
router.get('/profile/:profileId', async (req, res) => {
  try {
    const messages = db.prepare(
      'SELECT * FROM messages WHERE profile_id = ? ORDER BY created_at DESC'
    ).all(req.params.profileId);
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

export default router;
